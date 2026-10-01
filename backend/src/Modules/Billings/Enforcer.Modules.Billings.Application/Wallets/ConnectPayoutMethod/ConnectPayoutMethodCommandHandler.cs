using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Contracts;
using Enforcer.Modules.Billings.Domain.Wallets;

namespace Enforcer.Modules.Billings.Application.Wallets.ConnectPayoutMethod;

internal sealed class ConnectPayoutMethodCommandHandler(
    IWalletRepository walletRepository,
    IStripeGateway stripeGateway) : ICommandHandler<ConnectPayoutMethodCommand, SessionResponse>
{
    public async Task<Result<SessionResponse>> Handle(
        ConnectPayoutMethodCommand request,
        CancellationToken cancellationToken)
    {
        var wallet = await walletRepository.GetByUserIdAsync(request.UserId, cancellationToken);
        if (wallet!.IsPayoutMethodConfigured)
            return WalletErrors.PayoutMethodIsConfigured;

        var result = await stripeGateway.CreateOnboardingSessionAsync(
            wallet.StripeConnectAccountId,
            request.ReturnUrl,
            cancellationToken);

        if (result.IsFailure)
            return result.Error;

        return new SessionResponse(result.Value);
    }
}