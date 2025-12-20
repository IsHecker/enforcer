using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Contracts;
using Enforcer.Modules.Billings.Domain.Wallets;

namespace Enforcer.Modules.Billings.Application.Wallets.GetWalletByUser;

internal sealed class GetWalletByUserQueryHandler(
    IWalletRepository walletRepository)
    : IQueryHandler<GetWalletByUserQuery, WalletResponse>
{
    public async Task<Result<WalletResponse>> Handle(GetWalletByUserQuery request,
        CancellationToken cancellationToken)
    {
        var wallet = await walletRepository.GetByUserIdAsync(request.UserId, cancellationToken);
        if (wallet is null)
            return WalletErrors.NotFoundByUser(request.UserId);

        return wallet.ToResponse();
    }
}