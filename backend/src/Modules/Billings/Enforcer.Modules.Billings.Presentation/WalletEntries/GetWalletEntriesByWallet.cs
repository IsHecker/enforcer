using Enforcer.Common.Application.Data;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.WalletEntries.GetWalletEntriesByWallet;
using Enforcer.Modules.Billings.Contracts;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.WalletEntries;

internal sealed class GetWalletEntriesByWallet : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.WalletEntries.GetByWallet, async (
            Guid walletId,
            [AsParameters] Pagination pagination,
            ISender sender) =>
        {
            var result = await sender.Send(new GetWalletEntriesByWalletQuery(walletId, pagination));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.WalletEntries)
        .Produces<PagedResponse<WalletEntryResponse>>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(GetWalletEntriesByWallet));
    }
}