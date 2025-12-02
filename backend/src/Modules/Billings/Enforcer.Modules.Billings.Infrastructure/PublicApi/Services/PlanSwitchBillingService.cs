using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.ApiUsages;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.InvoiceLineItems;
using Enforcer.Modules.Billings.Domain.Invoices;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Billings.Infrastructure.PublicApi.Services;

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
        var invoice = PlanSwitchInvoiceFactory.CreatePlanSwitchInvoice(
            subscription,
            targetPlan,
            DateTime.UtcNow);

        await invoiceRepository.AddAsync(invoice, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return await ProcessPaymentAsync(invoice, cancellationToken);
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

        return await stripeGateway.ChargeAsync(invoice, cancellationToken);
    }
}

internal static class PlanSwitchInvoiceFactory
{
    private readonly record struct InvoiceContext(
        Invoice Invoice,
        PlanResponse CurrentPlan,
        PlanResponse TargetPlan,
        DateTime Now,
        DateTime ExpiresAt);

    public static Invoice CreatePlanSwitchInvoice(
        SubscriptionResponse subscription,
        PlanResponse targetPlan,
        DateTime now)
    {
        ValidateInputs(subscription, targetPlan, now);

        var currentPlan = subscription.Plan;
        var expiresAt = subscription.ExpiresAt!.Value;

        var invoice = Invoice.Create(
            subscription.ConsumerId,
            "USD",
            subscription.Id,
            now,
            subscription.ExpiresAt,
            $"Plan switch: {currentPlan.Name} → {targetPlan.Name}");

        var context = new InvoiceContext(
            invoice,
            currentPlan,
            targetPlan,
            now,
            expiresAt);

        AddOutstandingOverages(context, subscription.ApiUsage);

        if (IsFreePlan(currentPlan))
        {
            AddFullPriceNewPlanCharge(context);
            return invoice;
        }

        AddCreditForUnusedTime(context);

        if (IsFreePlan(targetPlan))
            return invoice;

        if (!IsSameBillingPeriod(context))
            AddFullPriceNewPlanCharge(context);
        else
            AddProratedNewPlanCharge(context);

        return invoice;
    }

    private static void AddProratedNewPlanCharge(InvoiceContext context)
    {
        var proratedAmount = ProrationCalculatorService.CalculateProrated(
            context.TargetPlan.PriceInCents,
            context.TargetPlan.BillingPeriod!,
            context.ExpiresAt,
            context.Now);

        var daysRemaining = ProrationCalculatorService.CalculateDaysRemaining(context.ExpiresAt, context.Now);

        context.Invoice.AddLineItem(InvoiceLineItem.Create(
            InvoiceItemType.Subscription,
            $"{context.TargetPlan.Name} ({daysRemaining} days prorated)",
            proratedAmount,
            periodStart: context.Now,
            periodEnd: context.ExpiresAt));
    }

    private static void AddCreditForUnusedTime(InvoiceContext context)
    {
        var currentPlan = context.CurrentPlan;

        var creditAmount = ProrationCalculatorService.CalculateProrated(
            currentPlan.PriceInCents,
            currentPlan.BillingPeriod!,
            context.ExpiresAt,
            context.Now);

        var daysRemaining = ProrationCalculatorService.CalculateDaysRemaining(context.ExpiresAt, context.Now);

        context.Invoice.AddLineItem(InvoiceLineItem.Create(
            InvoiceItemType.Credit,
            $"Credit: {currentPlan.Name} ({daysRemaining} days unused)",
            -creditAmount,
            periodStart: context.Now,
            periodEnd: context.ExpiresAt));
    }

    private static void AddFullPriceNewPlanCharge(InvoiceContext context)
    {
        var nextBillingDate = ProrationCalculatorService.GetNextBillingDate(context.TargetPlan.BillingPeriod!, context.Now);

        context.Invoice.AddLineItem(InvoiceLineItem.Create(
            InvoiceItemType.Subscription,
            $"{context.TargetPlan.Name} (new {context.TargetPlan.BillingPeriod} cycle)",
            context.TargetPlan.PriceInCents,
            periodStart: context.Now,
            periodEnd: nextBillingDate));
    }

    private static void AddOutstandingOverages(
        InvoiceContext context,
        ApiUsageResponse apiUsage)
    {
        var overagePriceInCents = context.CurrentPlan.OveragePriceInCents;

        if (apiUsage.OverageUsed <= 0 || !overagePriceInCents.HasValue)
            return;

        context.Invoice.AddLineItem(InvoiceLineItem.Create(
            InvoiceItemType.Overage,
            $"Outstanding overage: {apiUsage.OverageUsed:N0} calls",
            quantity: apiUsage.OverageUsed,
            unitPrice: overagePriceInCents.Value));
    }

    private static void ValidateInputs(
        SubscriptionResponse subscription,
        PlanResponse targetPlan,
        DateTime now)
    {
        ArgumentNullException.ThrowIfNull(subscription);

        ArgumentNullException.ThrowIfNull(targetPlan);

        if (subscription.Plan is null)
            throw new InvalidOperationException("Subscription must have a plan");

        if (!subscription.ExpiresAt.HasValue)
            throw new InvalidOperationException("Subscription must have an expiration date");

        if (subscription.ExpiresAt.Value <= now)
            throw new InvalidOperationException("Cannot switch plans on an expired subscription");
    }

    private static bool IsUpgradeFromFreePlan(InvoiceContext context) =>
        context.CurrentPlan.PriceInCents == 0;

    private static bool IsFreePlan(PlanResponse plan) =>
        plan.PriceInCents == 0;

    private static bool IsSameBillingPeriod(InvoiceContext context) =>
        context.CurrentPlan.BillingPeriod == context.TargetPlan.BillingPeriod;
}