using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.Plans.ListPlansForService;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.Plans;

internal sealed class ListPlansForService : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.Plans.ListPlansForService, async (Guid apiServiceId, ISender sender) =>
        {
            var result = await sender.Send(new ListPlansForServiceQuery(apiServiceId));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Plans)
        .Produces<IEnumerable<PlanResponse>>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(ListPlansForService));
    }
}