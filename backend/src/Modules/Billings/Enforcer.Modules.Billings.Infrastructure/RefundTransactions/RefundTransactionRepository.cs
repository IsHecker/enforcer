using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Billings.Domain.RefundTransactions;
using Enforcer.Modules.Billings.Infrastructure.Database;

namespace Enforcer.Modules.Billings.Infrastructure.RefundTransactions;

public class RefundTransactionRepository(BillingsDbContext context) : Repository<RefundTransaction>(context)
{

}