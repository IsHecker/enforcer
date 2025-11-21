using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Analytics.Application.PlanStats.GetPlanStat;
using Enforcer.Modules.Analytics.Contracts;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Analytics.Presentation.PlanStats;

internal sealed class GetPlanStat : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.Plans.GetStats, async (Guid planId, ISender sender) =>
        {
            var result = await sender.Send(new GetPlanStatQuery(planId));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Analytics)
        .WithOpenApiName(nameof(GetPlanStat))
        .Produces<PlanStatResponse>(StatusCodes.Status200OK);
    }
}