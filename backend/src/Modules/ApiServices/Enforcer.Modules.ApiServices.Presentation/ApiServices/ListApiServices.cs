using Enforcer.Common.Application.Data;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.ApiServices.ListApiServices;
using Enforcer.Modules.ApiServices.Contracts.ApiServices;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.ApiServices;

internal sealed class ListApiServices : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.ApiServices.List, async (
            [AsParameters] QueryParameters query,
            [AsParameters] Pagination pagination,
            ISender sender) =>
        {
            var result = await sender.Send(new ListApiServicesQuery(
                query.Category,
                query.Search,
                pagination
            ));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.ApiServices)
        .Produces<PagedResponse<ApiServiceResponse>>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(ListApiServices))
        .RequireCors("AllowAll");
    }

    internal readonly record struct QueryParameters(
        string? Category = null,
        string? Search = null
    );
}