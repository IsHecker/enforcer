using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Infrastructure.Payouts;
using Enforcer.Modules.Billings.Infrastructure.Wallets;
using Microsoft.Extensions.DependencyInjection;
using Stripe;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents.EventHandlers;

[StripeEvent(EventTypes.PayoutFailed)]
internal sealed class PayoutFailedHandler(
    PayoutRepository payoutRepository,
    WalletRepository walletRepository,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork) : StripeEventHandler<Payout>
{
    public override async Task<Result> HandleAsync(Payout payout)
    {
        var payoutId = payout.Get(MetadataKeys.PayoutId);

        await MarkPayoutAsFailedAsync(payout, payoutId);
        await RestoreBalanceAsync(payout, payoutId);

        await unitOfWork.SaveChangesAsync();

        return Result.Success;
    }

    private async Task MarkPayoutAsFailedAsync(Payout payout, Guid payoutId)
    {
        var payoutRecord = await payoutRepository.GetByIdAsync(payoutId);
        payoutRecord!.MarkAsFailed(payout.FailureMessage);
    }

    private async Task RestoreBalanceAsync(Payout payout, Guid payoutId)
    {
        var userId = payout.Get(MetadataKeys.UserId);
        var wallet = await walletRepository.GetByUserIdAsync(userId);
        wallet!.ReverseWithdrawal(payout.Amount, payoutId);
    }
}