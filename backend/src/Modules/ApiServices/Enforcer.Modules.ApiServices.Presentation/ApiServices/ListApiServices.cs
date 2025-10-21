using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.ApiServices.ListApiServices;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.ApiServices;

internal sealed class ListApiServices : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.ApiServices.List, async ([AsParameters] QueryParameters query, ISender sender) =>
        {
            var result = await sender.Send(new ListApiServicesQuery(
                query.PageNumber.GetValueOrDefault(),
                query.PageSize.GetValueOrDefault(),
                query.Category,
                query.IsPublic,
                query.Search
            ));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.ApiServices)
        .WithOpenApiName(nameof(ListApiServices));
    }

    internal record struct QueryParameters(
        int? PageNumber = 1,
        int? PageSize = 20,
        string? Category = null,
        bool? IsPublic = null,
        string? Search = null
    );
}