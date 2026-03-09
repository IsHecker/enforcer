using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Infrastructure.Payouts;
using Enforcer.Modules.Billings.Infrastructure.Wallets;
using Microsoft.Extensions.DependencyInjection;
using Stripe;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents.EventHandlers;

[StripeEvent(EventTypes.TransferReversed)]
internal sealed class TransferReversedHandler(
    PayoutRepository payoutRepository,
    WalletRepository walletRepository,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork) : StripeEventHandler<Transfer>
{
    public override async Task<Result> HandleAsync(Transfer transfer)
    {
        var payoutId = transfer.Get(MetadataKeys.PayoutId);

        await MarkPayoutAsFailedAsync(transfer, payoutId);
        await RestoreBalanceAsync(transfer, payoutId);

        await unitOfWork.SaveChangesAsync();

        return Result.Success;
    }

    private async Task MarkPayoutAsFailedAsync(Transfer transfer, Guid payoutId)
    {
        var payout = await payoutRepository.GetByIdAsync(payoutId);

        var reversal = transfer.Reversals?.Data?.FirstOrDefault();
        var errorMessage = reversal?.SourceRefund != null
            ? "Payment method failed or was disputed"
            : "Transfer was reversed by Stripe";

        payout!.MarkAsFailed(errorMessage);
    }

    private async Task RestoreBalanceAsync(Transfer transfer, Guid payoutId)
    {
        var userId = transfer.Get(MetadataKeys.UserId);
        var wallet = await walletRepository.GetByUserIdAsync(userId);
        wallet!.ReverseWithdrawal(transfer.Amount, payoutId);
    }
}