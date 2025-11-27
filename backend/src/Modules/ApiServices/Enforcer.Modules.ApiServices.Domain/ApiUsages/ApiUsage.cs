using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.Plans;

namespace Enforcer.Modules.ApiServices.Domain.ApiUsages;

public sealed class ApiUsage : Entity
{
    public Guid SubscriptionId { get; private set; }
    public int QuotasLeft { get; private set; }
    public int OverageUsed { get; private set; }
    public DateTime ResetAt { get; private set; }

    private ApiUsage() { }

    public static Result<ApiUsage> Create(
        Guid subscriptionId,
        int initialQuota,
        QuotaResetPeriod resetPeriod)
    {
        if (subscriptionId == Guid.Empty)
            return ApiUsageErrors.InvalidSubscriptionId;

        if (initialQuota < 0)
            return ApiUsageErrors.InvalidInitialQuota;

        var apiUsage = new ApiUsage
        {
            SubscriptionId = subscriptionId,
            QuotasLeft = initialQuota,
            ResetAt = CalculateNextResetDate(resetPeriod)
        };

        return apiUsage;
    }

    public Result ConsumeQuota(QuotaResetPeriod resetPeriod, int amount = 1)
    {
        if (amount <= 0)
            return ApiUsageErrors.InvalidConsumptionAmount;

        if (QuotasLeft < amount)
            return ApiUsageErrors.QuotaExceeded(resetPeriod.ToString());

        QuotasLeft -= amount;

        return Result.Success;
    }

    public void RecordOverage()
    {
        OverageUsed++;
    }

    public Result ResetUsage(int quotaLimit, QuotaResetPeriod resetPeriod, bool forceReset = false)
    {
        if (DateTime.UtcNow < ResetAt && !forceReset)
            return Result.Success;

        if (quotaLimit < 0)
            return ApiUsageErrors.InvalidResetQuota;

        DateTime newResetAt = CalculateNextResetDate(resetPeriod);

        if (newResetAt <= DateTime.UtcNow)
            return ApiUsageErrors.InvalidResetDate;

        QuotasLeft = quotaLimit;
        OverageUsed = 0;

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