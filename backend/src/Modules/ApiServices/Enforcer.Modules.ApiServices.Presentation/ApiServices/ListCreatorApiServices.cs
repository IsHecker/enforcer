using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.ApiServices.ListCreatorApiServices;
using Enforcer.Modules.ApiServices.Contracts.ApiServices;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.ApiServices;

internal sealed class ListCreatorApiServices : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.ApiServices.ListCreatorApiServices, async (
            Guid userId,
            [AsParameters] Pagination pagination,
            ISender sender) =>
        {
            var result = await sender.Send(new ListCreatorApiServicesQuery(
                userId,
                SharedData.UserId,
                pagination
            ));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.ApiServices)
        .Produces<PagedResponse<ApiServiceResponse>>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(ListCreatorApiServices));
    }
}