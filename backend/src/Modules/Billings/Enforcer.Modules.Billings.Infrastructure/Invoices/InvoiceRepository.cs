using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Infrastructure.Invoices;

internal sealed class InvoiceRepository(BillingsDbContext context) : Repository<Invoice>(context), IInvoiceRepository
{
    public Task<Invoice?> GetLastPaidBySubscriptionIdAsync(Guid subscriptionId, CancellationToken cancellationToken = default)
    {
        return context.Invoices
            .AsNoTracking()
            .OrderByDescending(i => i.PaidAt)
            .FirstOrDefaultAsync(i => i.SubscriptionId == subscriptionId, cancellationToken);
    }
}