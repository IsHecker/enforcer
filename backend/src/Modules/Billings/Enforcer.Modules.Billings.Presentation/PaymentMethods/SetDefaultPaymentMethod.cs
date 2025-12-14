using Enforcer.Common.Domain;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.PaymentMethods.SetDefaultPaymentMethod;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.PaymentMethods;

internal sealed class SetDefaultPaymentMethod : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch(ApiEndpoints.PaymentMethods.SetDefault, async (Guid paymentMethodId, ISender sender) =>
        {
            var result = await sender.Send(new SetDefaultPaymentMethodCommand(
                SharedData.UserId,
                paymentMethodId
            ));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.PaymentMethods)
        .WithOpenApiName(nameof(SetDefaultPaymentMethod));
    }
}