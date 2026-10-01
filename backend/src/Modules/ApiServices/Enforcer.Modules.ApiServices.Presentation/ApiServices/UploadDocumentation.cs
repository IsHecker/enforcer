using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.OpenApiDocumentations.UploadDocumentation;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.ApiServices;

internal sealed class UploadDocumentation : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.ApiServices.UploadDocumentation, async (Guid apiServiceId, Request request, ISender sender) =>
        {
            var result = await sender.Send(new UploadDocumentationCommand(apiServiceId, request.Specification));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.ApiServices)
        .Produces(StatusCodes.Status204NoContent)
        .WithOpenApiName(nameof(UploadDocumentation));
    }

    internal readonly record struct Request(string Specification);
}