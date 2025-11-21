using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Billings.Domain.Payments;
using Enforcer.Modules.Billings.Infrastructure.Database;

namespace Enforcer.Modules.Billings.Infrastructure.Payments;

internal sealed class PaymentRepository(BillingsDbContext context) : Repository<Payment>(context)
{

}