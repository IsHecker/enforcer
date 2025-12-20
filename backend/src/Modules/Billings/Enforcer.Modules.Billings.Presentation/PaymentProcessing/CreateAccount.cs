using Enforcer.Common.Domain;
using Enforcer.Common.Domain.Results;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.PaymentProcessing;

internal sealed class CreateAccount : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("api/stripe/create-account", async (
            [FromQuery] string country,
            IStripeGateway stripeGateway) =>
        {
            var result = (await stripeGateway.CreateConnectAccountAsync(SharedData.UserId, country)).ToResult();

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.PaymentProcessing)
        .WithOpenApiName(nameof(CreateAccount));
    }
}