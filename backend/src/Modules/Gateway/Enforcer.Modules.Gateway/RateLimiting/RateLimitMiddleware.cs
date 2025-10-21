using Enforcer.Common.Domain.Results;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.PublicApi;
using Enforcer.Modules.Gateway.Extensions;
using Microsoft.AspNetCore.Http;

namespace Enforcer.Modules.Gateway.RateLimiting;

public sealed class RateLimitMiddleware(
    RequestDelegate next,
    RateLimitService rateLimitService)
{
    public async Task InvokeAsync(HttpContext context, IApiServicesApi servicesApi)
    {
        var requestContext = context.GetRequestContext();
        var subscription = requestContext.Subscription!;
        var endpoint = requestContext.EndpointConfig!;

        var rateLimitConfig = DetermineRateLimitConfig(subscription.Plan!, endpoint);

        var rateLimitResult = await rateLimitService.ConsumeRateLimitTokenAsync(
            subscription.Id,
            rateLimitConfig);

        if (rateLimitResult.IsFailure)
        {
            await ErrorResponse(context, rateLimitResult.Error);
            return;
        }

        var plan = subscription.Plan!;
        var quotaResult = await servicesApi.ConsumeQuotaAsync(
            subscription.Id,
            plan.QuotaLimit,
            plan.QuotaResetPeriod);

        if (quotaResult.IsFailure)
        {
            await ErrorResponse(context, quotaResult.Error);
            return;
        }

        await next(context);
    }

    private static RateLimitConfig DetermineRateLimitConfig(
        PlanResponse plan,
        EndpointResponse endpoint)
    {
        if (endpoint.RateLimit.HasValue)
            return new(endpoint.RateLimit.Value, endpoint.RateLimitWindow!.Value, endpoint.Id);

        return new(plan.RateLimit, plan.RateLimitWindow, plan.PlanId);
    }

    private static async Task ErrorResponse(HttpContext context, Error error)
    {
        var problemResult = ApiResults.Problem(error);
        await problemResult.ExecuteAsync(context);
    }
}