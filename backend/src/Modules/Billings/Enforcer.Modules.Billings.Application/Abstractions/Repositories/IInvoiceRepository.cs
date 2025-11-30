using Enforcer.Common.Application.Data;
using Enforcer.Modules.Billings.Domain.Invoices;

namespace Enforcer.Modules.Billings.Application.Abstractions.Repositories;

public interface IInvoiceRepository : IRepository<Invoice>
{
    Task<Invoice?> GetLastPaidBySubscriptionIdAsync(Guid subscriptionId, CancellationToken cancellationToken = default);
}