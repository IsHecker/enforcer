using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.Invoices.GetInvoiceById;
using Enforcer.Modules.Billings.Contracts;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.Invoices;

internal sealed class GetInvoiceById : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.Invoices.GetById, async (Guid invoiceId, ISender sender) =>
        {
            var result = await sender.Send(new GetInvoiceByIdQuery(invoiceId));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Invoices)
        .Produces<InvoiceResponse>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(GetInvoiceById));
    }
}