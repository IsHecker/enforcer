using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Contracts;

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

        var result = await stripeGateway.CreateOnboardingSessionAsync(
            SharedData.ConnectedAccountId,
            request.ReturnUrl,
            cancellationToken);

        if (result.IsFailure)
            return result.Error;

        return new SessionResponse(result.Value);
    }
}