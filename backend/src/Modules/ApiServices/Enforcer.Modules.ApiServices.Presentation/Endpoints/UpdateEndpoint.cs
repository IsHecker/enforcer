using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.Endpoints.UpdateEndpoint;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.Endpoints;

internal sealed class UpdateEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(ApiEndpoints.Endpoints.Update, async (Guid endpointId, Request request, ISender sender) =>
        {
            var result = await sender.Send(new UpdateEndpointCommand(
                request.PlanId,
                endpointId,
                request.HttpMethod,
                request.PublicPath,
                request.TargetPath,
                request.RateLimit,
                request.RateLimitWindow,
                request.IsActive
            ));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.Endpoints)
        .WithOpenApiName(nameof(UpdateEndpoint));
    }

    internal readonly record struct Request(
        Guid PlanId,
        string HttpMethod,
        string PublicPath,
        string TargetPath,
        int? RateLimit,
        string? RateLimitWindow,
        bool IsActive
    );
}