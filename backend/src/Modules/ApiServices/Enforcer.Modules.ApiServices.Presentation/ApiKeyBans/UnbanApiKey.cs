using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.ApiKeyBans.UnbanApiKey;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.ApiKeyBans;

internal sealed class UnbanApiKey : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(ApiEndpoints.ApiKeys.Unban, async (string apiKey, ISender sender) =>
        {
            var result = await sender.Send(new UnbanApiKeyCommand(apiKey));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.ApiKeyBans)
        .WithOpenApiName(nameof(UnbanApiKey));
    }
}