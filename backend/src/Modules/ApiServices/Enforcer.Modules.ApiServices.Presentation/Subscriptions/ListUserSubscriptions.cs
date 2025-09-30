using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.Subscriptions.ListUserSubscriptions;
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
            var result = await sender.Send(new ListUserSubscriptionsQuery(Guid.Empty));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Subscriptions);
    }
}