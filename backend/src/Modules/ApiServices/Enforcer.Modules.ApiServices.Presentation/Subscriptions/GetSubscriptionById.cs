using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.Subscriptions.GetSubscriptionById;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.Subscriptions;

internal sealed class GetSubscriptionById : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.Subscriptions.GetById, async (Guid subscriptionId, ISender sender) =>
        {
            var result = await sender.Send(new GetSubscriptionByIdQuery(subscriptionId));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Subscriptions)
        .Produces<SubscriptionResponse>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(GetSubscriptionById));
    }
}