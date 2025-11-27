using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.PaymentMethods.ListConsumerPaymentMethods;
using Enforcer.Modules.Billings.Contracts;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.PaymentMethods;

internal sealed class ListConsumerPaymentMethods : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.PaymentMethods.ListByConsumer, async (ISender sender) =>
        {
            var result = await sender.Send(new ListConsumerPaymentMethodsQuery(
                Guid.Parse("3FA85F64-5717-4562-B3FC-2C963F66AFA6")
            ));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.PaymentMethods)
        .Produces<IEnumerable<PaymentMethodResponse>>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(ListConsumerPaymentMethods));
    }
}