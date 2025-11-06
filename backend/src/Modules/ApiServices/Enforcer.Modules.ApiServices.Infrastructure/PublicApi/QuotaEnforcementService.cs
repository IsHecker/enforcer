using Enforcer.Common.Application.Caching;
using Enforcer.Common.Application.Exceptions;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Enforcer.Modules.ApiServices.Domain.Usages;
using Microsoft.Extensions.Logging;

namespace Enforcer.Modules.ApiServices.Infrastructure.PublicApi;

internal class QuotaEnforcementService(
    ICacheService cacheService,
    IQuotaUsageRepository repository,
    ILogger<QuotaEnforcementService> logger)
{
    private static readonly TimeSpan QuotaUsageExpiration = TimeSpan.FromMinutes(5);

    public async Task<Result> ConsumeQuotaAsync(
        Guid subscriptionId,
        int quotaLimit,
        string resetPeriod)
    {
        var quotaUsage = await GetQuotaUsageAsync(subscriptionId);

        if (!Enum.TryParse<QuotaResetPeriod>(resetPeriod, true, out var period))
            return QuotaUsageErrors.InvalidResetPeriod;

        var resetResult = quotaUsage.ResetQuota(quotaLimit, period);

        if (resetResult.IsFailure)
            return resetResult.Error;

        var consumeResult = quotaUsage.ConsumeQuota(resetPeriod);

        if (consumeResult.IsFailure)
            return consumeResult.Error;

        logger.LogInformation(
            "Quota consumed for Subscription {SubscriptionId}: {Left}/{Limit} used (Period={ResetPeriod})",
            subscriptionId, quotaUsage.QuotasLeft, quotaLimit, resetPeriod);

        await CacheQuotaUsageAsync(quotaUsage, markForWriteBack: true);

        return Result.Success;
    }

    private async Task<QuotaUsage> GetQuotaUsageAsync(Guid subscriptionId)
    {
        var cached = await cacheService.GetAsync<QuotaUsage>(CacheKeys.QuotaUsage(subscriptionId));
        if (cached is not null)
        {
            logger.LogDebug(
                "Quota usage retrieved from cache for Subscription {SubscriptionId}: Left={Left}, ResetAt={ResetAtUtc}",
                subscriptionId, cached.QuotasLeft, cached.ResetAt);

            return cached;
        }

        var quotaUsage = await repository.GetBySubscriptionIdAsync(subscriptionId);
        if (quotaUsage is null)
            throw new EnforcerException($"Quota usage not found for subscription {subscriptionId}");

        logger.LogDebug(
            "Quota usage loaded from repository for Subscription {SubscriptionId}: Left={Left}, ResetAt={ResetAtUtc}",
            subscriptionId, quotaUsage.QuotasLeft, quotaUsage.ResetAt);

        await CacheQuotaUsageAsync(quotaUsage);

        return quotaUsage;
    }

    private async Task CacheQuotaUsageAsync(
        QuotaUsage quotaUsage,
        bool markForWriteBack = false)
    {
        var cacheKey = CacheKeys.QuotaUsage(quotaUsage.SubscriptionId);
        await cacheService.SetAsync(cacheKey, quotaUsage, QuotaUsageExpiration, markForWriteBack);
    }
}