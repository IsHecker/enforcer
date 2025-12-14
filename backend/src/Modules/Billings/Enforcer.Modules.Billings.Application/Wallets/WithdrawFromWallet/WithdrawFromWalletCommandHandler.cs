using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Application.Abstractions.Services;
using Enforcer.Modules.Billings.Domain.Wallets;

namespace Enforcer.Modules.Billings.Application.Wallets.WithdrawFromWallet;

internal sealed class WithdrawFromWalletCommandHandler(
    IWalletRepository walletRepository,
    IWithdrawalService withdrawalService)
    : ICommandHandler<WithdrawFromWalletCommand>
{
    public async Task<Result> Handle(WithdrawFromWalletCommand request,
        CancellationToken cancellationToken)
    {
        var wallet = await walletRepository.GetByIdAsync(request.WalletId, cancellationToken);
        if (wallet is null)
            return WalletErrors.NotFound(request.WalletId);

        var now = DateTime.UtcNow;

        return await withdrawalService.ProcessPayoutAsync(wallet, now, now, cancellationToken);
    }
}