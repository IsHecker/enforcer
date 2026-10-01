using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.Application.Invoices.ListConsumerInvoices;

public sealed record ListConsumerInvoicesQuery(
    Guid ConsumerId,
    Pagination Pagination) : IQuery<PagedResponse<InvoiceResponse>>;