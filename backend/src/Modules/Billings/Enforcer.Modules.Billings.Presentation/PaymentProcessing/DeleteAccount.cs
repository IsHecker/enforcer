using Enforcer.Common.Domain;
using Enforcer.Common.Domain.Results;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.PaymentProcessing;

internal sealed class DeleteAccount : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("api/stripe/delete-account{accountId}", async (
            string accountId,
            IStripeGateway stripeGateway) =>
        {
            await stripeGateway.DeleteAccount(accountId);
            var result = Result.Success;
            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.PaymentProcessing)
        .WithOpenApiName(nameof(DeleteAccount));
    }
}