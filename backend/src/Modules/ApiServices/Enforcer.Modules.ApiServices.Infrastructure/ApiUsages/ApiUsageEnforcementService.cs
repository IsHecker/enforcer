using Enforcer.Common.Application.Caching;
using Enforcer.Common.Application.Exceptions;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.ApiUsages;
using Enforcer.Modules.ApiServices.Domain.Plans;
using Microsoft.Extensions.Logging;

namespace Enforcer.Modules.ApiServices.Infrastructure.ApiUsages;

internal sealed class ApiUsageEnforcementService(
    ICacheService cacheService,
    IApiUsageRepository repository,
    ILogger<ApiUsageEnforcementService> logger)
{
    private static readonly TimeSpan ApiUsageExpiration = TimeSpan.FromMinutes(5);

    public async Task<Result> ConsumeQuotaAsync(Guid subscriptionId, Plan plan)
    {
        var apiUsage = await GetApiUsageAsync(subscriptionId);

        var resetResult = apiUsage.ResetUsage(plan.QuotaLimit, plan.QuotaResetPeriod);

        if (resetResult.IsFailure)
            return resetResult.Error;

        var consumeResult = apiUsage.ConsumeQuota(plan.QuotaResetPeriod);

        if (consumeResult.IsFailure)
        {
            if (!plan.IsOverageAllowed(apiUsage.OverageUsed))
                return consumeResult.Error;

            apiUsage.RecordOverage();
        }

        logger.LogInformation(
            "Quota consumed for Subscription {SubscriptionId}: {Left}/{Limit} used (Period={ResetPeriod})",
            subscriptionId, apiUsage.QuotasLeft, plan.QuotaLimit, plan.QuotaResetPeriod);

        await CacheApiUsageAsync(apiUsage, markForWriteBack: true);

        return Result.Success;
    }

    private async Task<ApiUsage> GetApiUsageAsync(Guid subscriptionId)
    {
        var cached = await cacheService.GetAsync<ApiUsage>(CacheKeys.ApiUsage(subscriptionId));
        if (cached is not null)
        {
            logger.LogDebug(
                "Quota usage retrieved from cache for Subscription {SubscriptionId}: Left={Left}, ResetAt={ResetAtUtc}",
                subscriptionId, cached.QuotasLeft, cached.ResetAt);

            return cached;
        }

        var apiUsage = await repository.GetBySubscriptionIdAsync(subscriptionId);
        if (apiUsage is null)
            throw new EnforcerException($"Quota usage not found for subscription {subscriptionId}");

        logger.LogDebug(
            "Quota usage loaded from repository for Subscription {SubscriptionId}: Left={Left}, ResetAt={ResetAtUtc}",
            subscriptionId, apiUsage.QuotasLeft, apiUsage.ResetAt);

        await CacheApiUsageAsync(apiUsage);

        return apiUsage;
    }

    private async Task CacheApiUsageAsync(
        ApiUsage apiUsage,
        bool markForWriteBack = false)
    {
        var cacheKey = CacheKeys.ApiUsage(apiUsage.SubscriptionId);
        await cacheService.SetAsync(cacheKey, apiUsage, ApiUsageExpiration, markForWriteBack);
    }
}