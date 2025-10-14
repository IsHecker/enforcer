using Enforcer.Common.Application.Caching;
using Enforcer.Common.Application.Exceptions;
using Enforcer.Common.Domain.Results;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.ApiServices.Contracts.Usages;
using Enforcer.Modules.ApiServices.PublicApi;
using Enforcer.Modules.Gateway.Extensions;
using Microsoft.AspNetCore.Http;

namespace Enforcer.Modules.Gateway.RateLimiting;

public class RateLimitMiddleware(
    RequestDelegate next,
    RateLimitService rateLimitService)
{
    private UsageTrackingService _usageTrackingService = null!;

    public async Task InvokeAsync(HttpContext context, UsageTrackingService usageTrackingService)
    {
        _usageTrackingService = usageTrackingService;

        var requestContext = ExtractRequestContext(context);

        var rateLimitResult = await CheckRateLimitAsync(requestContext);
        if (!rateLimitResult.IsAllowed)
        {
            await LimitErrorResponse(context, rateLimitResult.ErrorMessage!);
            return;
        }

        var quotaResult = await CheckQuotaAsync(requestContext);
        if (quotaResult.IsFailure)
        {
            await ErrorResponse(context, quotaResult.Error);
            return;
        }

        await UpdateUsageCountersAsync(requestContext, quotaResult.Value);
        await next(context);
    }

    private static RequestContext ExtractRequestContext(HttpContext context)
    {
        var apiService = context.GetApiService()!;
        var subscription = context.GetSubscription()!;
        var endpoint = context.GetEndpointConfig()!;

        var (rateLimit, target) = DetermineRateLimitConfig(apiService.Id, subscription.Plan!, endpoint);

        return new RequestContext(
            Subscription: subscription,
            ServiceId: apiService.Id,
            EndpointId: endpoint.Id,
            RateLimit: rateLimit,
            RateLimitTarget: target,
            QuotaLimit: subscription.Plan!.QuotaLimit);
    }

    private static (int RateLimit, string Target) DetermineRateLimitConfig(
        Guid serviceId,
        PlanResponse plan,
        EndpointResponse endpoint)
    {
        return endpoint.RateLimit.HasValue
            ? (endpoint.RateLimit.Value, endpoint.Id.ToString())
            : (plan.RateLimit, serviceId.ToString());
    }

    private async Task<Result<QuotaUsageResponse>> CheckQuotaAsync(RequestContext requestContext)
    {
        var quotaUsage = await _usageTrackingService.GetQuotaUsageAsync(
            requestContext.Subscription.Id,
            requestContext.ServiceId);

        if (quotaUsage.QuotasLeft > 0)
            return quotaUsage;

        var quotaResetPeriod = requestContext.Subscription.Plan!.QuotaResetPeriod;
        var wasReset = await _usageTrackingService.TryResetQuotaUsageAsync(quotaUsage, requestContext.QuotaLimit, quotaResetPeriod);

        return wasReset
            ? quotaUsage
            : Error.TooManyRequests(description: $"{quotaResetPeriod} quota exceeded. Please upgrade your plan.");
    }

    private async Task<LimitCheckResult> CheckRateLimitAsync(RequestContext requestContext)
    {
        return LimitCheckResult.Allowed();

        var isExceeded = await rateLimitService.IsRateLimitExceededAsync(
            requestContext.Subscription.Id,
            requestContext.RateLimit,
            requestContext.RateLimitTarget);

        return isExceeded
            ? LimitCheckResult.Denied("Rate limit exceeded. Please try again later.")
            : LimitCheckResult.Allowed();
    }

    private async Task UpdateUsageCountersAsync(RequestContext requestContext, QuotaUsageResponse quotaUsage)
    {
        // await rateLimitService.IncrementRequestCountAsync(
        //     context.Subscription.Id,
        //     context.RateLimitTarget);

        await _usageTrackingService.DecrementQuotaAsync(quotaUsage);
    }

    private static async Task LimitErrorResponse(HttpContext context, string message)
    {
        var result = Results.Json(new { message }, statusCode: StatusCodes.Status429TooManyRequests);
        await result.ExecuteAsync(context);
    }

    private static async Task ErrorResponse(HttpContext context, Error error)
    {
        var problemResult = ApiResults.Problem(error);
        await problemResult.ExecuteAsync(context);
    }

    private record struct RequestContext(
        SubscriptionResponse Subscription,
        Guid ServiceId,
        Guid EndpointId,
        int RateLimit,
        string RateLimitTarget,
        int QuotaLimit);

    private record struct LimitCheckResult(bool IsAllowed, string? ErrorMessage)
    {
        public static LimitCheckResult Allowed() => new(true, null);
        public static LimitCheckResult Denied(string message) => new(false, message);
    }
}

public class UsageTrackingService(ICacheService cacheService, IApiServicesApi servicesApi)
{
    private static readonly TimeSpan QuotaUsageCacheExpiration = TimeSpan.FromMinutes(5);

    internal async Task DecrementQuotaAsync(QuotaUsageResponse quotaUsage)
    {
        quotaUsage.QuotasLeft--;
        await CacheQuotaUsageAsync(quotaUsage, markForWriteBack: true);
    }

    internal async Task<QuotaUsageResponse> GetQuotaUsageAsync(Guid subscriptionId, Guid serviceId)
    {
        var cached = await GetFromCacheAsync(subscriptionId, serviceId);
        if (cached is not null)
            return cached;

        var quotaUsage = await FetchQuotaUsageAsync(subscriptionId, serviceId);
        await CacheQuotaUsageAsync(quotaUsage);

        return quotaUsage;
    }

    internal async Task<bool> TryResetQuotaUsageAsync(
        QuotaUsageResponse quotaUsage,
        int quotaLimit,
        string quotaResetPeriod)
    {
        if (DateTime.UtcNow < quotaUsage.ResetAt)
            return false;

        quotaUsage.QuotasLeft = quotaLimit;
        quotaUsage.ResetAt = CalculateNextResetDate(quotaResetPeriod);
        await CacheQuotaUsageAsync(quotaUsage, markForWriteBack: true);

        return true;
    }

    private async Task<QuotaUsageResponse> FetchQuotaUsageAsync(Guid subscriptionId, Guid serviceId)
    {
        var quotaUsage = await servicesApi.GetQuotaUsageAsync(subscriptionId, serviceId);

        if (quotaUsage is null)
            throw new EnforcerException($"Quota usage not found for subscription {subscriptionId}");

        return quotaUsage;
    }

    private async Task<QuotaUsageResponse?> GetFromCacheAsync(Guid subscriptionId, Guid serviceId)
            => await cacheService.GetAsync<QuotaUsageResponse>(CacheKeys.QuotaUsage(subscriptionId, serviceId));

    private async Task CacheQuotaUsageAsync(QuotaUsageResponse quotaUsage, bool markForWriteBack = false)
        => await cacheService.SetAsync(
            CacheKeys.QuotaUsage(quotaUsage.SubscriptionId, quotaUsage.ApiServiceId),
            quotaUsage,
            QuotaUsageCacheExpiration,
            markForWriteBack);

    private static DateTime CalculateNextResetDate(string resetPeriod)
    {
        var now = DateTime.UtcNow;
        return resetPeriod switch
        {
            "Daily" => now.AddDays(1),
            "Weekly" => now.AddDays(7),
            "Monthly" => now.AddMonths(1),
            "Yearly" => now.AddYears(1),
            _ => now.AddMonths(1)
        };
    }
}

public class RateLimitService(ICacheService cacheService)
{
    internal async Task<bool> IsRateLimitExceededAsync(
        Guid subscriptionId,
        int rateLimit,
        string target)
    {
        var currentCount = await GetFromCacheAsync(subscriptionId, target);
        if (currentCount is null)
            throw new EnforcerException("Unexpected error");

        return currentCount >= rateLimit;
    }

    internal async Task IncrementRequestCountAsync(
        Guid subscriptionId,
        string target)
    {
        var currentCount = await GetFromCacheAsync(subscriptionId, target);

        await CacheCounterAsync(subscriptionId, target, currentCount.Value + 1);
    }

    private async Task<int?> GetFromCacheAsync(Guid subscriptionId, string target)
        => await cacheService.GetAsync<int>(CacheKeys.RateLimit(subscriptionId, target));

    private async Task CacheCounterAsync(Guid subscriptionId, string target, int counter)
            => await cacheService.SetAsync(CacheKeys.RateLimit(subscriptionId, target), counter);
}