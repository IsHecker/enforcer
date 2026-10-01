using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.Domain.Services;

namespace Enforcer.Modules.Billings.Infrastructure.Invoicing;

internal static class InvoiceFactory
{
    public static Invoice ForSubscription(
        Guid consumerId,
        PlanResponse plan,
        DateTime? expiresAt,
        long discountAmount = 0,
        string? discountDescription = null,
        long walletCreditUsed = 0)
    {
        var lineItems = new List<LineItem>
        {
            LineItem.Create(
                LineItemType.Subscription,
                $"{plan.Name} - Subscription",
                plan.PriceInCents)
        };

        if (discountAmount > 0)
        {
            lineItems.Add(LineItem.Create(
                LineItemType.Discount,
                discountDescription ?? "Discount applied",
                -discountAmount));
        }

        if (walletCreditUsed > 0)
        {
            lineItems.Add(LineItem.Create(
                LineItemType.Credit,
                $"Wallet credits applied",
                -walletCreditUsed));
        }

        return Invoice.Create(
            consumerId, "USD",
            lineItems,
            periodStart: DateTime.UtcNow,
            periodEnd: expiresAt);
    }

    public static Invoice ForRenewal(SubscriptionResponse subscription)
    {
        var plan = subscription.Plan;

        var lineItems = new List<LineItem>
        {
            LineItem.Create(
                LineItemType.Subscription,
                $"{plan.Name} - Renewal",
                plan.PriceInCents)
        };

        AddOverageIfApplicable(lineItems, plan, subscription);

        return Invoice.Create(
            subscription.ConsumerId, "USD", lineItems,
            referenceId: subscription.Id,
            periodStart: DateTime.UtcNow,
            periodEnd: subscription.ExpiresAt);
    }

    public static Invoice ForPlanSwitch(
        SubscriptionResponse subscription,
        PlanResponse targetPlan,
        DateTime now)
    {
        ArgumentNullException.ThrowIfNull(subscription);
        ArgumentNullException.ThrowIfNull(targetPlan);

        if (subscription.Plan is null)
            throw new InvalidOperationException("Subscription must have a plan.");

        if (!subscription.ExpiresAt.HasValue)
            throw new InvalidOperationException("Subscription must have an expiration date.");

        if (subscription.ExpiresAt.Value <= now)
            throw new InvalidOperationException("Cannot switch plans on an expired subscription.");

        var currentPlan = subscription.Plan;
        var expiresAt = subscription.ExpiresAt.Value;
        var lineItems = new List<LineItem>();

        AddOverageIfApplicable(lineItems, currentPlan, subscription);

        if (currentPlan.PriceInCents > 0)
            AddCreditForUnusedTime(lineItems, currentPlan, expiresAt, now);

        if (targetPlan.PriceInCents > 0)
            AddNewPlanCharge(lineItems, currentPlan, targetPlan, expiresAt, now);

        if (lineItems.Count == 0)
        {
            lineItems.Add(LineItem.Create(
                LineItemType.Subscription,
                $"{targetPlan.Name} - Plan switch (no charge)",
                0));
        }

        return Invoice.Create(
            subscription.ConsumerId, "USD", lineItems,
            referenceId: subscription.Id,
            periodStart: now,
            periodEnd: expiresAt,
            notes: $"Plan switch: {currentPlan.Name} → {targetPlan.Name}");
    }

    private static void AddOverageIfApplicable(
        List<LineItem> lineItems,
        PlanResponse plan,
        SubscriptionResponse subscription)
    {
        if (subscription.ApiUsage.OverageUsed <= 0 || !plan.OveragePriceInCents.HasValue)
            return;

        lineItems.Add(LineItem.Create(
            LineItemType.Overage,
            $"API overage: {subscription.ApiUsage.OverageUsed:N0} calls",
            plan.OveragePriceInCents.Value,
            subscription.ApiUsage.OverageUsed));
    }

    private static void AddCreditForUnusedTime(
        List<LineItem> lineItems,
        PlanResponse currentPlan,
        DateTime expiresAt,
        DateTime now)
    {
        var (creditAmount, daysRemaining) = ProrationCalculatorService.CalculateProrated(
            currentPlan.PriceInCents, currentPlan.BillingPeriod!, expiresAt, now);

        if (creditAmount <= 0)
            return;

        lineItems.Add(LineItem.Create(
            LineItemType.Credit,
            $"Credit: {currentPlan.Name} ({daysRemaining} days unused)",
            -creditAmount,
            periodStart: now,
            periodEnd: expiresAt));
    }

    private static void AddNewPlanCharge(
        List<LineItem> lineItems,
        PlanResponse currentPlan,
        PlanResponse targetPlan,
        DateTime expiresAt,
        DateTime now)
    {
        if (currentPlan.BillingPeriod == targetPlan.BillingPeriod)
        {
            var (amount, days) = ProrationCalculatorService.CalculateProrated(
                targetPlan.PriceInCents, targetPlan.BillingPeriod!, expiresAt, now);

            lineItems.Add(LineItem.Create(
                LineItemType.Subscription,
                $"{targetPlan.Name} ({days} days prorated)",
                amount,
                periodStart: now,
                periodEnd: expiresAt));
        }
        else
        {
            var nextBillingDate = ProrationCalculatorService.GetNextBillingDate(
                targetPlan.BillingPeriod, now);

            lineItems.Add(LineItem.Create(
                LineItemType.Subscription,
                $"{targetPlan.Name} (new {targetPlan.BillingPeriod} cycle)",
                targetPlan.PriceInCents,
                periodStart: now,
                periodEnd: nextBillingDate));
        }
    }
}