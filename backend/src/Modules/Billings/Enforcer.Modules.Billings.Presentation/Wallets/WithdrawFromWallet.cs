using Enforcer.Common.Domain;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.Wallets.WithdrawFromWallet;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.Wallets;

internal sealed class WithdrawFromWallet : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Wallets.Withdrawl, async (Request request, ISender sender) =>
        {
            var result = await sender.Send(new WithdrawFromWalletCommand(SharedData.WalletId, request.Amount));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.Wallets)
        .WithOpenApiName(nameof(WithdrawFromWallet));
    }

    internal readonly record struct Request(long Amount);
}