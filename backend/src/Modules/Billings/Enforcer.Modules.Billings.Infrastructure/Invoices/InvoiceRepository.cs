using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.Infrastructure.Database;

namespace Enforcer.Modules.Billings.Infrastructure.Invoices;

internal sealed class InvoiceRepository(BillingsDbContext context) : Repository<Invoice>(context)
{

}