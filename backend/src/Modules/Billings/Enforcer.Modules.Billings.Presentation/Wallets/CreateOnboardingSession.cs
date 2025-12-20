using Enforcer.Common.Domain;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.Wallets.ConnectPayoutMethod;
using Enforcer.Modules.Billings.Contracts;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.Wallets;

internal sealed class CreateOnboardingSession : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Wallets.CreateOnboardingSession, async (Request request, ISender sender) =>
        {
            var result = await sender.Send(new ConnectPayoutMethodCommand(SharedData.UserId, request.ReturnUrl));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Wallets)
        .Produces<SessionResponse>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(CreateOnboardingSession));
    }

    internal readonly record struct Request(string ReturnUrl);
}