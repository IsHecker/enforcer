using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.Subscriptions.ListUserSubscriptions;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.Subscriptions;

internal sealed class ListUserSubscriptions : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.Subscriptions.ListUserSubscriptions, async (ISender sender) =>
        {
            var result = await sender.Send(new ListUserSubscriptionsQuery(Guid.Parse("3FA85F64-5717-4562-B3FC-2C963F66AFA6")));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Subscriptions)
        .Produces<IEnumerable<SubscriptionResponse>>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(ListUserSubscriptions));
    }
}