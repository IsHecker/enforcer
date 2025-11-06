using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.ApiServices.DeleteApiService;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.ApiServices;

internal sealed class DeleteApiService : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(ApiEndpoints.ApiServices.Delete, async (Guid apiServiceId, ISender sender) =>
        {
            var result = await sender.Send(new DeleteApiServiceCommand(apiServiceId));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.ApiServices)
        .WithOpenApiName(nameof(DeleteApiService));
    }
}