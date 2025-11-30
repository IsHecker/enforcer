using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Billings.Domain.Payments;
using Enforcer.Modules.Billings.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Infrastructure.Payments;

internal sealed class PaymentRepository(BillingsDbContext context) : Repository<Payment>(context)
{
    public Task<Payment?> GetLastBySucceededInvoiceId(Guid invoiceId, CancellationToken cancellationToken = default)
    {
        return context.Payments
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.InvoiceId == invoiceId
                && p.Status == PaymentStatus.Succeeded, cancellationToken);
    }
}