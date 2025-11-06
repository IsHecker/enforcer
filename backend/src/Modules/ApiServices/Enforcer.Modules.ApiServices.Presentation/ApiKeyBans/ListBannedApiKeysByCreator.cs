using Enforcer.Common.Application.Data;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.ApiKeyBans.ListBannedApiKeysByCreator;
using Enforcer.Modules.ApiServices.Contracts.ApiKeyBlacklist;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.ApiKeyBans;

internal sealed class ListBannedApiKeysByCreator : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.ApiKeys.ListBannedApiKeys, async (
            [FromQuery] Guid creatorId,
            [AsParameters] Pagination pagination,
            ISender sender) =>
        {
            var result = await sender.Send(new ListBannedApiKeysByCreatorQuery(creatorId, pagination));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.ApiKeyBans)
        .Produces<PagedResponse<ApiKeyBanResponse>>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(ListBannedApiKeysByCreator));
    }
}