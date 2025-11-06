using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Analytics.Application.ApiServiceStats.RateApiService;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Analytics.Presentation.ApiServiceStats;

internal sealed class RateApiService : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.ApiServices.Rate, async (Guid apiServiceId, Request request, ISender sender) =>
        {
            var result = await sender.Send(new RateApiServiceCommand(
                Guid.Parse("3FA85F64-5717-4562-B3FC-2C963F66AFA6"),
                apiServiceId,
                request.Rating
            ));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.Analytics)
        .WithOpenApiName(nameof(RateApiService));
    }

    internal readonly record struct Request(byte? Rating);
}