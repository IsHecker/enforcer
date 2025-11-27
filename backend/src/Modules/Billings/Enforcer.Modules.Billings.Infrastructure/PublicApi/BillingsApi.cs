using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.InvoiceLineItems;
using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.PublicApi;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Billings.Infrastructure.PublicApi;


internal readonly record struct PlanSwitchContext(
    SubscriptionResponse Subscription,
    PlanResponse TargetPlan
);


internal sealed class BillingsApi(PlanSwitchBillingService planSwitchBillingService) : IBillingsApi
{
    public Task<Result> ProcessPlanSwitchBillingAsync(
        SubscriptionResponse subscription,
        PlanResponse targetPlan,
        CancellationToken ct = default)
    {
        return planSwitchBillingService.ProcessBillingAsync(subscription, targetPlan, ct);
    }
}

internal sealed class PlanSwitchBillingService(
    IInvoiceRepository invoiceRepository,
    IStripeGateway stripeGateway,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork)
{
    public async Task<Result> ProcessBillingAsync(
        SubscriptionResponse subscription,
        PlanResponse targetPlan,
        CancellationToken cancellationToken = default)
    {
        var context = new PlanSwitchContext(subscription, targetPlan);

        var invoice = PlanSwitchInvoiceFactory.CreatePlanSwitchInvoice(context);

        await invoiceRepository.AddAsync(invoice, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // Handle payment based on invoice total
        var paymentResult = await ProcessPaymentAsync(invoice, cancellationToken);

        if (paymentResult.IsFailure)
            return paymentResult.Error;

        return Result.Success;
    }

    private async Task<Result> ProcessPaymentAsync(
        Invoice invoice,
        CancellationToken ct)
    {
        if (invoice.Total <= 0)
        {
            invoice.MarkAsPaid();
            await unitOfWork.SaveChangesAsync(ct);

            return Result.Success;
        }

        var chargeResult = await stripeGateway.ChargeAsync(invoice, ct);

        return chargeResult.IsSuccess ?
            Result.Success : chargeResult.Error;
    }
}

internal static class PlanSwitchInvoiceFactory
{
    public static Invoice CreatePlanSwitchInvoice(PlanSwitchContext context)
    {
        var lineItems = new List<InvoiceLineItem>();

        var subscription = context.Subscription;

        var now = DateTime.UtcNow;
        var daysRemaining = CalculateDaysRemaining(subscription.ExpiresAt, now);

        if (IsFreePlan(subscription.Plan!))
        {
            AddTrialUpgradeCharge(lineItems, context, daysRemaining, now);
        }
        else
        {
            AddOldPlanCredit(lineItems, context, daysRemaining, now);
            AddNewPlanCharge(lineItems, context, daysRemaining, now);
        }

        AddOutstandingOverages(lineItems, context);

        return Invoice.Create(
            subscription.ConsumerId,
            "USD",
            lineItems: lineItems,
            subscriptionId: subscription.Id,
            notes: $"Plan switch: {subscription.Plan!.Name} → {context.TargetPlan.Name}"
        );
    }

    private static void AddTrialUpgradeCharge(
        List<InvoiceLineItem> items,
        PlanSwitchContext context,
        int daysRemaining,
        DateTime now)
    {
        var prorated = CalculateProrated(
            context.TargetPlan.PriceInCents,
            GetBillingPeriodDays(context.TargetPlan.BillingPeriod),
            daysRemaining
        );

        items.Add(InvoiceLineItem.Create(
            InvoiceItemType.Subscription,
            $"{context.TargetPlan.Name} ({daysRemaining} days prorated)",
            quantity: 1,
            unitPrice: prorated,
            periodStart: now,
            periodEnd: context.Subscription.ExpiresAt
        ));
    }

    private static void AddOldPlanCredit(
        List<InvoiceLineItem> items,
        PlanSwitchContext context,
        int daysRemaining,
        DateTime now)
    {
        var currentPlan = context.Subscription.Plan!;

        var credit = CalculateProrated(
            currentPlan.PriceInCents,
            GetBillingPeriodDays(currentPlan.BillingPeriod),
            daysRemaining
        );

        items.Add(InvoiceLineItem.Create(
            InvoiceItemType.Credit,
            $"Credit: {currentPlan.Name} ({daysRemaining} days unused)",
            quantity: 1,
            unitPrice: -credit,
            periodStart: now,
            periodEnd: context.Subscription.ExpiresAt
        ));
    }

    private static void AddNewPlanCharge(
        List<InvoiceLineItem> items,
        PlanSwitchContext context,
        int daysRemaining,
        DateTime now)
    {
        var targetPlan = context.TargetPlan;

        if (!IsSameBillingPeriod(context.Subscription.Plan!, targetPlan))
        {
            items.Add(InvoiceLineItem.Create(
                InvoiceItemType.Subscription,
                $"{targetPlan.Name} (new {targetPlan.BillingPeriod} cycle)",
                quantity: 1,
                unitPrice: targetPlan.PriceInCents,
                periodStart: now,
                periodEnd: now.AddDays(GetBillingPeriodDays(targetPlan.BillingPeriod))
            ));

            return;
        }

        var charge = CalculateProrated(
            targetPlan.PriceInCents,
            GetBillingPeriodDays(targetPlan.BillingPeriod),
            daysRemaining
        );

        items.Add(InvoiceLineItem.Create(
            InvoiceItemType.Subscription,
            $"{targetPlan.Name} ({daysRemaining} days prorated)",
            quantity: 1,
            unitPrice: charge,
            periodStart: now,
            periodEnd: context.Subscription.ExpiresAt
        ));
    }

    private static void AddOutstandingOverages(
        List<InvoiceLineItem> items,
        PlanSwitchContext context)
    {
        var apiUsage = context.Subscription.ApiUsage;

        if (apiUsage is null ||
            apiUsage.OverageUsed <= 0 ||
            !context.Subscription.Plan!.OveragePriceInCents.HasValue)
        {
            return;
        }

        items.Add(InvoiceLineItem.Create(
            InvoiceItemType.Overage,
            $"Outstanding overage: {apiUsage.OverageUsed:N0} calls",
            quantity: apiUsage.OverageUsed,
            unitPrice: context.Subscription.Plan.OveragePriceInCents.Value
        ));
    }

    private static bool IsFreePlan(PlanResponse plan) => plan.PriceInCents == 0;
    private static bool IsSameBillingPeriod(PlanResponse currentPlan, PlanResponse targetPlan)
        => currentPlan.BillingPeriod == targetPlan.BillingPeriod;

    private static int CalculateDaysRemaining(DateTime? expiresAt, DateTime now) =>
        Math.Max(0, (expiresAt.GetValueOrDefault() - now).Days);

    private static int GetBillingPeriodDays(string? period) => period?.ToLower() switch
    {
        "monthly" => 30,
        "yearly" => 365,
        _ => 30
    };

    public static long CalculateProrated(long fullPrice, int totalDays, int remainingDays)
    {
        if (remainingDays <= 0) return 0;
        if (remainingDays >= totalDays) return fullPrice;

        var dailyRate = (decimal)fullPrice / totalDays;
        return (long)Math.Ceiling(dailyRate * remainingDays);
    }
}