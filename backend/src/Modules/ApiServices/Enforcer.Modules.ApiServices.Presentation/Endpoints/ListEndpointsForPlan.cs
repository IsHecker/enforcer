using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.Endpoints.ListEndpointsForPlan;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.Endpoints;

internal sealed class ListEndpointsForPlan : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.Endpoints.ListEndpointsForPlan, async (Guid planId, ISender sender) =>
        {
            Common.Domain.Results.Result<IEnumerable<Contracts.Endpoints.EndpointResponse>> result = await sender.Send(new ListEndpointsForPlanQuery(planId));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Endpoints)
        .Produces<IEnumerable<EndpointResponse>>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(ListEndpointsForPlan));
    }
}