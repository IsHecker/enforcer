using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.Endpoints.CreateEndpoint;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.Endpoints;

internal sealed class CreateEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Endpoints.Create, async (Guid apiServiceId, Request request, ISender sender) =>
        {
            var result = await sender.Send(new CreateEndpointCommand(
                apiServiceId,
                request.PlanId,
                request.HttpMethod,
                request.PublicPath,
                request.TargetPath,
                request.RateLimit,
                request.RateLimitWindow,
                request.IsActive
            ));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Endpoints)
        .WithOpenApiName(nameof(CreateEndpoint));
    }

    internal record Request(
        Guid PlanId,
        string HttpMethod,
        string PublicPath,
        string TargetPath,
        int? RateLimit,
        string? RateLimitWindow,
        bool IsActive
    );
}