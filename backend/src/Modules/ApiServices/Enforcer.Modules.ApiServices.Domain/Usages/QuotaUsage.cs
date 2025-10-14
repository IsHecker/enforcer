using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.Usages.Events;

namespace Enforcer.Modules.ApiServices.Domain.Usages;

public class QuotaUsage : Entity
{
    public Guid SubscriptionId { get; private set; }
    public Guid ApiServiceId { get; private set; }
    public int QuotasLeft { get; private set; }
    public DateTime ResetAt { get; private set; }

    private QuotaUsage() { }

    public static Result<QuotaUsage> Create(
        Guid subscriptionId,
        Guid apiServiceId,
        int initialQuota,
        DateTime resetAt,
        Guid? id = null)
    {
        if (subscriptionId == Guid.Empty)
            return QuotaUsageErrors.InvalidSubscriptionId;

        if (initialQuota < 0)
            return QuotaUsageErrors.InvalidInitialQuota;

        if (resetAt <= DateTime.UtcNow)
            return QuotaUsageErrors.InvalidResetDate;

        var quotaUsage = new QuotaUsage
        {
            Id = id ?? Guid.NewGuid(),
            SubscriptionId = subscriptionId,
            ApiServiceId = apiServiceId,
            QuotasLeft = initialQuota,
            ResetAt = resetAt
        };

        return quotaUsage;
    }

    public Result ConsumeQuota(int amount = 1)
    {
        if (amount <= 0)
            return QuotaUsageErrors.InvalidConsumptionAmount;

        if (QuotasLeft < amount)
            return QuotaUsageErrors.QuotaExceeded;

        QuotasLeft -= amount;

        Raise(new QuotaConsumedEvent(Id, SubscriptionId, amount, QuotasLeft));

        return Result.Success;
    }

    public Result ResetQuota(int newQuota, DateTime newResetAt)
    {
        if (newQuota < 0)
            return QuotaUsageErrors.InvalidResetQuota;

        if (newResetAt <= DateTime.UtcNow)
            return QuotaUsageErrors.InvalidResetDate;

        QuotasLeft = newQuota;
        ResetAt = newResetAt;

        Raise(new QuotaResetEvent(Id, SubscriptionId, QuotasLeft, ResetAt));

        return Result.Success;
    }
}