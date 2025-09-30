using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.Subscriptions.ChangeSubscriptionPlan;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.Subscriptions;

internal sealed class ChangeSubscriptionPlan : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch(ApiEndpoints.Subscriptions.ChangeSubscriptionPlan, async (Guid subscriptionId, Request request, ISender sender) =>
        {
            var result = await sender.Send(new ChangeSubscriptionPlanCommand(subscriptionId, request.TargetPlanId));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.Subscriptions);
    }

    internal record Request(Guid TargetPlanId);
}