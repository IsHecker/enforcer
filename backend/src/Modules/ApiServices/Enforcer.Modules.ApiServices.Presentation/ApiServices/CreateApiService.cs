using Enforcer.Common.Domain;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.ApiServices.CreateApiService;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.ApiServices;

internal sealed class CreateApiService : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.ApiServices.Create, async (Request request, ISender sender) =>
        {
            var result = await sender.Send(new CreateApiServiceCommand(
                SharedData.UserId,
                request.Name,
                request.Description,
                request.Category,
                request.ServiceKey,
                request.TargetBaseUrl,
                request.LogoUrl,
                request.IsPublic,
                request.Status
            ));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.ApiServices)
        .Produces<Guid>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(CreateApiService));
    }

    internal readonly record struct Request(
        string Name,
        string Description,
        string Category,
        string ServiceKey,
        string TargetBaseUrl,
        string? LogoUrl,
        bool IsPublic,
        string Status
    );
}