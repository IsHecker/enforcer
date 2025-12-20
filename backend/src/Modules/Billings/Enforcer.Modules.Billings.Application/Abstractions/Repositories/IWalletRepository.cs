using Enforcer.Common.Application.Data;
using Enforcer.Modules.Billings.Domain.Wallets;

namespace Enforcer.Modules.Billings.Application.Abstractions.Repositories;

public interface IWalletRepository : IRepository<Wallet>
{
    Task<Wallet?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Wallet?> GetByStripeAccountIdAsync(string accountId, CancellationToken cancellationToken = default);
}