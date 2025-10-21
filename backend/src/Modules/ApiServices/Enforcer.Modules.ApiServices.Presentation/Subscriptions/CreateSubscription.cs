using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.Subscriptions.CreateSubscription;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.Subscriptions;

internal sealed class CreateSubscription : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Subscriptions.Create, async (Request request, ISender sender) =>
        {
            var result = await sender.Send(new CreateSubscriptionCommand(
                Guid.NewGuid(),
                request.PlanId,
                request.ApiServiceId
            ));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Subscriptions)
        .WithOpenApiName(nameof(CreateSubscription));
    }

    internal sealed record Request(
        Guid PlanId,
        Guid ApiServiceId
    );
}