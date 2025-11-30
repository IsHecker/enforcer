using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.PaymentProcessing;

internal sealed class StripeWebhook : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Payments.StripeWebhook, async (HttpContext context, IStripeEventDispatcher dispatcher) =>
        {
            var json = await new StreamReader(context.Request.Body).ReadToEndAsync();
            var stripeSignature = context.Request.Headers["Stripe-Signature"];

            var result = await dispatcher.DispatchAsync(json, stripeSignature!);

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.PaymentProcessing)
        .WithOpenApiName(nameof(StripeWebhook));
    }
}