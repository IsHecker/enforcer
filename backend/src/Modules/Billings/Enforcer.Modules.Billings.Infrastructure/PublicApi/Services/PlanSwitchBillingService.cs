using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.InvoiceLineItems;
using Enforcer.Modules.Billings.Domain.Invoices;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Billings.Infrastructure.PublicApi.Services;

internal readonly record struct PlanSwitchContext(
    SubscriptionResponse Subscription,
    PlanResponse TargetPlan
);

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
        CancellationToken cancellationToken)
    {
        if (invoice.Total <= 0)
        {
            invoice.MarkAsPaid();
            await unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success;
        }

        var chargeResult = await stripeGateway.ChargeAsync(invoice, cancellationToken);

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
            lineItems,
            subscription.Id,
            now,
            subscription.ExpiresAt,
            $"Plan switch: {subscription.Plan!.Name} → {context.TargetPlan.Name}"
        );
    }

    private static void AddTrialUpgradeCharge(
        List<InvoiceLineItem> items,
        PlanSwitchContext context,
        int daysRemaining,
        DateTime now)
    {
        var prorated = ProrationCalculatorService.CalculateProrated(
            context.TargetPlan.PriceInCents,
            GetBillingPeriodDays(context.TargetPlan.BillingPeriod),
            daysRemaining
        );

        items.Add(InvoiceLineItem.Create(
            InvoiceItemType.Subscription,
            $"{context.TargetPlan.Name} ({daysRemaining} days prorated)",
            prorated,
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

        var credit = ProrationCalculatorService.CalculateProrated(
            currentPlan.PriceInCents,
            GetBillingPeriodDays(currentPlan.BillingPeriod),
            daysRemaining
        );

        items.Add(InvoiceLineItem.Create(
            InvoiceItemType.Credit,
            $"Credit: {currentPlan.Name} ({daysRemaining} days unused)",
            -credit,
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
                targetPlan.PriceInCents,
                periodStart: now,
                periodEnd: now.AddDays(GetBillingPeriodDays(targetPlan.BillingPeriod))
            ));

            return;
        }

        var charge = ProrationCalculatorService.CalculateProrated(
            targetPlan.PriceInCents,
            GetBillingPeriodDays(targetPlan.BillingPeriod),
            daysRemaining
        );

        items.Add(InvoiceLineItem.Create(
            InvoiceItemType.Subscription,
            $"{targetPlan.Name} ({daysRemaining} days prorated)",
            charge,
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

    public static int CalculateDaysRemaining(DateTime? expiresAt, DateTime now) =>
        Math.Max(0, (expiresAt.GetValueOrDefault() - now).Days);

    private static int GetBillingPeriodDays(string? period) => period?.ToLower() switch
    {
        "monthly" => 30,
        "yearly" => 365,
        _ => 30
    };
}