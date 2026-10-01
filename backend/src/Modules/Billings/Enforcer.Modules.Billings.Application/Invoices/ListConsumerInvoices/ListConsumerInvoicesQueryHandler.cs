using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Data;
using Enforcer.Modules.Billings.Contracts;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Application.Invoices.ListConsumerInvoices;

internal sealed class ListConsumerInvoicesQueryHandler(IBillingsDbContext context)
    : IQueryHandler<ListConsumerInvoicesQuery, PagedResponse<InvoiceResponse>>
{
    public async Task<Result<PagedResponse<InvoiceResponse>>> Handle(ListConsumerInvoicesQuery request, CancellationToken cancellationToken)
    {
        var query = context.Invoices
            .Where(i => i.ConsumerId == request.ConsumerId);

        var totalCount = await query.CountAsync(cancellationToken);

        return await query
            .OrderByDescending(i => i.IssuedAt)
            .Paginate(request.Pagination)
            .Select(invoice => invoice.ToResponse())
            .ToPagedResponseAsync(request.Pagination, totalCount);
    }
}