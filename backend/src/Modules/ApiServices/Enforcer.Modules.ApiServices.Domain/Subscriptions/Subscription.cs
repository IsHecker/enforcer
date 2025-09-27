using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions;

public class Subscription : Entity
{
    public Guid ConsumerId { get; private set; }
    public Guid PlanId { get; private set; }
    public Guid ApiServiceId { get; private set; }
    public string ApiKey { get; private set; } = null!;
    public DateTime SubscribedAt { get; private set; }
    public DateTime? ExpiresAt { get; private set; }
    public bool IsCanceled { get; private set; } = false;

    public bool IsExpired => ExpiresAt.HasValue && ExpiresAt < DateTime.UtcNow;
    public bool IsFree => !ExpiresAt.HasValue;

    public Plan Plan { get; init; } = null!;

    private Subscription() { }

    public static Result<Subscription> Create(
        Guid consumerId,
        Plan plan)
    {
        if (consumerId == Guid.Empty)
            return SubscriptionErrors.InvalidConsumerId;

        if (plan is null)
            return SubscriptionErrors.InvalidPlan;

        if (!plan.IsActive)
            return PlanErrors.InactivePlan;

        var subscriptionDate = DateTime.UtcNow;

        var subscription = new Subscription
        {
            ConsumerId = consumerId,
            PlanId = plan.Id,
            ApiServiceId = plan.ApiServiceId,
            ApiKey = GenerateApiKey(),
            SubscribedAt = subscriptionDate,
            ExpiresAt = CalculateExpiration(subscriptionDate, plan.BillingPeriod)
        };

        subscription.Raise(new SubscriptionCreatedEvent(
            subscription.Id,
            subscription.PlanId,
            subscription.ApiServiceId));

        return subscription;
    }

    public Result Renew()
    {
        if (IsCanceled)
            return SubscriptionErrors.CannotRenewCanceled;

        if (IsFree)
            return SubscriptionErrors.NoExpirationToRenew;

        ExpiresAt = CalculateExpiration(DateTime.UtcNow, Plan.BillingPeriod)!;

        Raise(new SubscriptionRenewedEvent(Id, ConsumerId, PlanId, ExpiresAt.Value));

        return Result.Success;
    }

    public Result Cancel()
    {
        if (IsCanceled)
            return SubscriptionErrors.AlreadyCanceled;

        if (IsExpired)
            return SubscriptionErrors.AlreadyExpired;

        IsCanceled = true;

        Raise(new SubscriptionCanceledEvent(Id, ConsumerId, PlanId, ExpiresAt));

        return Result.Success;
    }

    public Result ChangePlan(Plan targetPlan)
    {
        if (IsCanceled)
            return SubscriptionErrors.CannotChangePlanWhenCanceled;

        if (!targetPlan.IsActive)
            return PlanErrors.InactivePlan;

        var oldPlanId = PlanId;
        PlanId = targetPlan.Id;
        Raise(new SubscriptionPlanChangedEvent(Id, oldPlanId, targetPlan.Id));
        return Result.Success;
    }

    private static string GenerateApiKey()
        => Convert.ToBase64String(Guid.NewGuid().ToByteArray())
                  .Replace("=", "")
                  .Replace("+", "")
                  .Replace("/", "")
                  .ToLowerInvariant();

    private static DateTime? CalculateExpiration(DateTime subscriptionDate, BillingPeriods? billingPeriod)
    {
        if (billingPeriod is null)
            return null;

        return billingPeriod switch
        {
            BillingPeriods.Monthly => subscriptionDate.AddMonths(1),
            BillingPeriods.Yearly => subscriptionDate.AddYears(1),
            _ => subscriptionDate.AddMonths(1)
        };
    }
}