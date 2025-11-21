using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.PaymentProcessing.CreateSetupSession;
using Enforcer.Modules.Billings.Contracts;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.Payments;

internal sealed class CreateSetupSession : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Payments.CreateSetupSession, async (Request request, ISender sender) =>
        {
            var result = await sender.Send(new CreateSetupSessionCommand(
                Guid.Empty,
                request.ReturnUrl
            ));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Payments)
        .Produces<CheckoutSessionResponse>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(CreateSetupSession));
    }

    internal readonly record struct Request(string ReturnUrl);
}