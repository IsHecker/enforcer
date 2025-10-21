using Enforcer.Common.Domain.Results;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Contracts.ApiKeyBlacklist;
using Enforcer.Modules.ApiServices.PublicApi;
using Enforcer.Modules.Gateway.Extensions;
using Microsoft.AspNetCore.Http;

namespace Enforcer.Modules.Gateway.Security;

public sealed class ApiKeyAuthenticationMiddleware(RequestDelegate next)
{
    private const string ApiKeyHeader = "X-Api-Key";

    public async Task InvokeAsync(HttpContext context, IApiServicesApi servicesApi)
    {
        var requestContext = context.GetRequestContext();
        var serviceKey = requestContext.ServiceKey!;
        var apiKey = ExtractApiKey(context);

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            await ErrorResponse(context, Error.Unauthorized(description: "Missing API key."));
            return;
        }

        var subscription = await servicesApi.GetSubscriptionForServiceAsync(apiKey, serviceKey);

        if (subscription is null)
        {
            await ErrorResponse(context, Error.Forbidden(
                "Access denied",
                "Invalid API key or no subscription found for this service."));
            return;
        }

        if (subscription.IsExpired)
        {
            await ErrorResponse(context, Error.Forbidden(description: "Subscription expired."));
            return;
        }

        var banDetails = await CheckIfApiKeyBanned(servicesApi, apiKey);
        if (banDetails is not null)
        {
            var expiryMessage = banDetails.Duration.HasValue
                ? $"Ban expires: {banDetails.Duration:dd-MM-yyyy HH:mm:ss UTC}"
                : "Permanent ban";

            await ErrorResponse(context, Error.Forbidden(
                "API key is banned",
                $"Reason: {banDetails.Reason}. {expiryMessage}"));
            return;
        }

        requestContext.Subscription = subscription;

        await next(context);
    }

    private static async Task<ApiKeyBlacklistResponse?> CheckIfApiKeyBanned(IApiServicesApi servicesApi, string apiKey)
    {
        var blacklistedApiKey = await servicesApi.GetBlacklistedApiKeyAsync(apiKey);

        if (blacklistedApiKey is null)
            return null;

        if (blacklistedApiKey.HasExpired(DateTime.UtcNow))
        {
            await servicesApi.LiftBanFromApiKeyAsync(apiKey);
            return null;
        }

        return blacklistedApiKey;
    }

    private static string? ExtractApiKey(HttpContext context)
        => context.Request.Headers[ApiKeyHeader].FirstOrDefault();

    private static async Task ErrorResponse(HttpContext context, Error error)
    {
        var problemResult = ApiResults.Problem(error);
        await problemResult.ExecuteAsync(context);
    }
}