using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.Endpoints.CreateEndpoint;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.Endpoints;

internal sealed class CreateEndpoints : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Endpoints.Create, async (Guid apiServiceId, Request request, ISender sender) =>
        {
            var endpoints = request.Endpoints.Select(e => new EndpointCreationData(
                e.PlanId,
                e.HttpMethod,
                e.PublicPath,
                e.TargetPath,
                e.RateLimit,
                e.RateLimitWindow,
                e.IsActive
            ));

            var result = await sender.Send(new CreateEndpointsCommand(apiServiceId, endpoints));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Endpoints)
        .Produces<IEnumerable<Guid>>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(CreateEndpoints));
    }

    internal readonly record struct Request(IEnumerable<EndpointCreationRequest> Endpoints);

    internal readonly record struct EndpointCreationRequest(
        Guid PlanId,
        string HttpMethod,
        string PublicPath,
        string TargetPath,
        int? RateLimit,
        string? RateLimitWindow,
        bool IsActive
    );
}