using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Contracts;
using Enforcer.Modules.Billings.Domain.Invoices;

namespace Enforcer.Modules.Billings.Application.Invoices.GetInvoiceById;

internal sealed class GetInvoiceByIdQueryHandler(IInvoiceRepository invoiceRepository)
    : IQueryHandler<GetInvoiceByIdQuery, InvoiceResponse>
{
    public async Task<Result<InvoiceResponse>> Handle(GetInvoiceByIdQuery query, CancellationToken cancellationToken)
    {
        var invoice = await invoiceRepository.GetByIdAsync(query.InvoiceId, cancellationToken);

        if (invoice is null)
            return InvoiceErrors.NotFound(query.InvoiceId);

        return invoice.ToResponse();
    }
}