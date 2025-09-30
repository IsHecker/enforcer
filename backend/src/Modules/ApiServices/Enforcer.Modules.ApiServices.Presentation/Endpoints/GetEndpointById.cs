using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.Endpoints.GetEndpointById;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.Endpoints;

internal sealed class GetEndpointById : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.Endpoints.GetById, async (Guid endpointId, ISender sender) =>
        {
            var result = await sender.Send(new GetEndpointByIdQuery(endpointId));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Endpoints);
    }
}