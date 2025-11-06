using Enforcer.Common.Domain.Results;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.PublicApi;
using Enforcer.Modules.Gateway.Core.Extensions;
using Microsoft.AspNetCore.Http;

namespace Enforcer.Modules.Gateway.Core.Security;

public sealed class EndpointAuthorizationMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, IApiServicesApi servicesApi)
    {
        var requestContext = context.GetRequestContext();
        var subscription = requestContext.Subscription!;
        var endpoint = requestContext.EndpointConfig;

        if (endpoint is null)
        {
            await ErrorResponse(context,
                Error.NotFound(description: "Endpoint not found"));
            return;
        }

        if (!endpoint.IsActive)
        {
            await ErrorResponse(context,
                Error.Forbidden(description: "Endpoint is not active"));
            return;
        }

        var isSubscribed = await servicesApi.IsSubscribedToRequiredPlanAsync(subscription.Plan!, endpoint.PlanId);

        if (!isSubscribed)
        {
            await ErrorResponse(context,
                Error.Forbidden(description: "Subscription plan does not allow access to this endpoint"));
            return;
        }

        await next(context);
    }

    private static async Task ErrorResponse(HttpContext context, Error error)
    {
        var problemResult = ApiResults.Problem(error);
        await problemResult.ExecuteAsync(context);
    }
}