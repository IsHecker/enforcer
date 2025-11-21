using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Analytics.Application.SubscriptionStats.GetSubscriptionStat;
using Enforcer.Modules.Analytics.Contracts;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Analytics.Presentation.SubscriptionStats;

internal sealed class GetSubscriptionStat : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.Subscriptions.GetStats, async (Guid subscriptionId, ISender sender) =>
        {
            var result = await sender.Send(new GetSubscriptionStatQuery(subscriptionId));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Analytics)
        .WithOpenApiName(nameof(GetSubscriptionStat))
        .Produces<SubscriptionStatResponse>(StatusCodes.Status200OK);
    }
}