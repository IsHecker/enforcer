using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.PaymentMethods.RemovePaymentMethod;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.PaymentMethods;

internal sealed class RemovePaymentMethod : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(ApiEndpoints.PaymentMethods.Delete, async (Guid paymentMethodId, ISender sender) =>
        {
            var result = await sender.Send(new RemovePaymentMethodCommand(paymentMethodId));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.PaymentMethods)
        .WithOpenApiName(nameof(RemovePaymentMethod));
    }
}