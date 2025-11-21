using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Analytics.Application.EndpointStats.ListEndpointStats;
using Enforcer.Modules.Analytics.Contracts;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Analytics.Presentation.EndpointStats;

internal sealed class ListEndpointStats : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.Analytics.ListEndpointStats, async (
            [AsParameters] QueryParameters query,
            ISender sender) =>
        {
            var result = await sender.Send(new ListEndpointStatsQuery(query.EndpointIds));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Analytics)
        .WithOpenApiName(nameof(ListEndpointStats))
        .Produces<IEnumerable<EndpointStatResponse>>(StatusCodes.Status200OK);
    }

    internal readonly record struct QueryParameters(Guid[] EndpointIds);
}