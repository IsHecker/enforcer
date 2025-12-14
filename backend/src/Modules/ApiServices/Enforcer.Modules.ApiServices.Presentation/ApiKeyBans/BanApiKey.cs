using Enforcer.Common.Domain;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.ApiKeyBans.BanApiKey;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.ApiKeyBans;

internal sealed class BanApiKey : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.ApiKeys.Ban, async (string apiKey, Request request, ISender sender) =>
        {
            var result = await sender.Send(new BanApiKeyCommand(
                SharedData.UserId,
                apiKey,
                request.Reason,
                request.ExpiresAt
            ));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.ApiKeyBans)
        .WithOpenApiName(nameof(BanApiKey));
    }

    internal readonly record struct Request(
        string Reason,
        DateTime? ExpiresAt = null);
}