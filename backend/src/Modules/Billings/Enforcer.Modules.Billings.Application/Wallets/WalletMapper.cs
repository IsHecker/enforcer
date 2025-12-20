using Enforcer.Modules.Billings.Contracts;
using Enforcer.Modules.Billings.Domain.Wallets;

namespace Enforcer.Modules.Billings.Application.Wallets;

public static class WalletMapper
{
    public static WalletResponse ToResponse(this Wallet wallet) =>
        new(
            wallet.UserId,
            wallet.Balance,
            wallet.Credits,
            wallet.LifetimeEarnings,
            wallet.Currency,
            wallet.LastPayoutAt,
            wallet.IsOnboardingComplete,
            wallet.IsPayoutMethodConfigured
        );
}