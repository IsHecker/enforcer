using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.Wallets;
using Enforcer.Modules.Billings.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Infrastructure.Wallets;

internal class WalletRepository(BillingsDbContext context) : Repository<Wallet>(context), IWalletRepository
{
    public Task<Wallet?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return context.Wallets
            .FirstOrDefaultAsync(w => w.UserId == userId, cancellationToken);
    }
}