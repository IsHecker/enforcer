using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Domain.Usages;

public sealed class QuotaUsage : Entity
{
    public Guid SubscriptionId { get; private set; }
    public int QuotasLeft { get; private set; }
    public DateTime ResetAt { get; private set; }

    private QuotaUsage() { }

    public static Result<QuotaUsage> Create(
        Guid subscriptionId,
        int initialQuota,
        QuotaResetPeriod resetPeriod)
    {
        if (subscriptionId == Guid.Empty)
            return QuotaUsageErrors.InvalidSubscriptionId;

        if (initialQuota < 0)
            return QuotaUsageErrors.InvalidInitialQuota;

        var quotaUsage = new QuotaUsage
        {
            SubscriptionId = subscriptionId,
            QuotasLeft = initialQuota,
            ResetAt = CalculateNextResetDate(resetPeriod)
        };

        return quotaUsage;
    }

    public Result ConsumeQuota(string resetPeriod, int amount = 1)
    {
        if (amount <= 0)
            return QuotaUsageErrors.InvalidConsumptionAmount;

        if (QuotasLeft < amount)
            return QuotaUsageErrors.QuotaExceeded(resetPeriod);

        QuotasLeft -= amount;

        return Result.Success;
    }

    public Result ResetQuota(int quotaLimit, QuotaResetPeriod resetPeriod, bool forceReset = false)
    {
        if (DateTime.UtcNow < ResetAt && !forceReset)
            return Result.Success;

        if (quotaLimit < 0)
            return QuotaUsageErrors.InvalidResetQuota;

        DateTime newResetAt = CalculateNextResetDate(resetPeriod);

        if (newResetAt <= DateTime.UtcNow)
            return QuotaUsageErrors.InvalidResetDate;

        QuotasLeft = quotaLimit;
        ResetAt = newResetAt;

        return Result.Success;
    }

    private static DateTime CalculateNextResetDate(QuotaResetPeriod resetPeriod)
    {
        var now = DateTime.UtcNow;

        return resetPeriod switch
        {
            QuotaResetPeriod.Daily => now.AddDays(1),
            QuotaResetPeriod.Weekly => now.AddMinutes(1),
            QuotaResetPeriod.Monthly => now.AddMonths(1),
            QuotaResetPeriod.Yearly => now.AddYears(1),
            _ => now.AddMonths(1)
        };
    }
}