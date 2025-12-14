using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Billings.Domain.WalletEntries;
using Enforcer.Modules.Billings.Infrastructure.Database;

namespace Enforcer.Modules.Billings.Infrastructure.WalletEntries;

internal sealed class WalletEntryRepository(BillingsDbContext context) : Repository<WalletEntry>(context)
{

}