using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Billings.Domain.Payouts;
using Enforcer.Modules.Billings.Infrastructure.Database;

namespace Enforcer.Modules.Billings.Infrastructure.Payouts;

internal sealed class PayoutRepository(BillingsDbContext context) : Repository<Payout>(context)
{
}