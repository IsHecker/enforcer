using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.PaymentProcessing.CreateCheckoutSession;
using Enforcer.Modules.Billings.Contracts;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.Payments;

internal sealed class CreateCheckoutSession : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Payments.CreateCheckoutSession, async (Request request, ISender sender) =>
        {
            var result = await sender.Send(new CreateCheckoutSessionCommand(
                Guid.Parse("3FA85F64-5717-4562-B3FC-2C963F66AFA6"),
                request.PlanId,
                request.ReturnUrl
            ));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Payments)
        .Produces<CheckoutSessionResponse>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(CreateCheckoutSession));
    }

    internal readonly record struct Request(string ReturnUrl, Guid PlanId);
}