using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.Subscriptions.SwitchSubscriptionPlan;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.Subscriptions;

internal sealed class SwitchSubscriptionPlan : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch(ApiEndpoints.Subscriptions.SwitchSubscriptionPlan, async (
            Guid subscriptionId,
            Request request,
            ISender sender) =>
        {
            var result = await sender.Send(new SwitchSubscriptionPlanCommand(subscriptionId, request.TargetPlanId));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.Subscriptions)
        .WithOpenApiName(nameof(SwitchSubscriptionPlan));
    }

    internal readonly record struct Request(Guid TargetPlanId);
}