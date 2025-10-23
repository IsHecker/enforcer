using System.Security.Cryptography;
using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions;

public sealed class Subscription : Entity
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

    public Plan Plan { get; private set; } = null!;
    public ApiService ApiService { get; init; } = null!;

    private Subscription() { }

    public static Result<Subscription> Create(
        Guid consumerId,
        Plan plan)
    {
        if (consumerId == Guid.Empty)
            return SubscriptionErrors.InvalidConsumerId;

        if (!plan.IsActive)
            return SubscriptionErrors.InactivePlan;

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

        Raise(new SubscriptionCanceledEvent(Id, ApiServiceId, PlanId, ExpiresAt));

        return Result.Success;
    }

    public Result ChangePlan(Plan targetPlan)
    {
        if (IsCanceled)
            return SubscriptionErrors.CannotChangePlanWhenCanceled;

        if (IsExpired)
            return SubscriptionErrors.CannotChangePlanWhenCanceled;

        if (!targetPlan.IsActive)
            return SubscriptionErrors.InactivePlan;

        var oldPlanId = PlanId;
        var oldExpirationDate = ExpiresAt;

        PlanId = targetPlan.Id;
        Plan = targetPlan;

        ExpiresAt = DeterminePlanChangeExpiration(targetPlan);

        Raise(new SubscriptionPlanChangedEvent(
            Id,
            oldPlanId,
            targetPlan.Id,
            SubscribedAt,
            oldExpirationDate));

        return Result.Success;
    }

    private DateTime? DeterminePlanChangeExpiration(Plan targetPlan)
    {
        if (targetPlan.BillingPeriod == Plan.BillingPeriod)
            return ExpiresAt;

        var baseDate = targetPlan.BillingPeriod > Plan.BillingPeriod
            ? SubscribedAt
            : DateTime.UtcNow;

        return CalculateExpiration(baseDate, targetPlan.BillingPeriod);
    }

    private static string GenerateApiKey()
    {
        const int keyBytes = 24;
        const int base64Length = 32;

        Span<byte> bytes = stackalloc byte[keyBytes];
        RandomNumberGenerator.Fill(bytes);

        Span<char> base64Chars = stackalloc char[base64Length];
        Convert.TryToBase64Chars(bytes, base64Chars, out _);

        for (int i = 0; i < base64Chars.Length; i++)
        {
            switch (base64Chars[i])
            {
                case '+':
                case '=':
                    base64Chars[i] = RandomLowerCase();
                    break;
                case '/':
                    base64Chars[i] = RandomNumber();
                    break;
            }
        }

        return new string(base64Chars);

        static char RandomLowerCase() => (char)RandomNumberGenerator.GetInt32(97, 123);
        static char RandomNumber() => (char)RandomNumberGenerator.GetInt32(48, 58);
    }

    private static DateTime? CalculateExpiration(DateTime subscriptionDate, BillingPeriod? billingPeriod)
    {
        if (billingPeriod is null)
            return null;

        return billingPeriod switch
        {
            BillingPeriod.Monthly => subscriptionDate.AddMonths(1),
            BillingPeriod.Yearly => subscriptionDate.AddYears(1),
            _ => subscriptionDate.AddMonths(1)
        };
    }
}