using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Billings.Domain.Refunds;
using Enforcer.Modules.Billings.Infrastructure.Database;

namespace Enforcer.Modules.Billings.Infrastructure.Refunds;

public class RefundRepository(BillingsDbContext context) : Repository<Refund>(context);