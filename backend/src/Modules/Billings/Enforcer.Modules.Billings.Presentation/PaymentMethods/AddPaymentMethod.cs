using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.PaymentMethods.CreatePaymentMethod;
using Enforcer.Modules.Billings.Contracts;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.PaymentMethods;

internal sealed class AddPaymentMethod : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.PaymentMethods.Create, async (Request request, ISender sender) =>
        {
            var result = await sender.Send(new CreatePaymentMethodCommand(
                Guid.Empty,
                request.ReturnUrl
            ));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.PaymentMethods)
        .Produces<CheckoutSessionResponse>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(AddPaymentMethod));
    }

    internal readonly record struct Request(string ReturnUrl);
}