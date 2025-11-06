using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.ApiServices.UpdateApiService;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.ApiServices;

internal sealed class UpdateApiService : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(ApiEndpoints.ApiServices.Update, async (Guid apiServiceId, Request request, ISender sender) =>
        {
            var result = await sender.Send(new UpdateApiServiceCommand(
                apiServiceId,
                request.Name,
                request.Description,
                request.Category,
                request.ServiceKey,
                request.TargetBaseUrl,
                request.LogoUrl,
                request.IsPublic,
                request.Status,
                request.Version
            ));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.ApiServices)
        .WithOpenApiName(nameof(UpdateApiService));
    }

    internal readonly record struct Request(
        string Name,
        string Description,
        string Category,
        string ServiceKey,
        string TargetBaseUrl,
        string? LogoUrl,
        bool IsPublic,
        string Status,
        string Version
    );
}