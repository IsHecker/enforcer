using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.OpenApiDocumentations.GetDocumentationForService;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.ApiServices;

internal sealed class GetDocumentationForService : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.ApiServices.GetDocumentation, async (Guid apiServiceId, ISender sender) =>
        {
            var result = await sender.Send(new GetDocumentationForServiceQuery(apiServiceId));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.ApiServices)
        .Produces<string>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(GetDocumentationForService));
    }
}