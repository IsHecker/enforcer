using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Infrastructure.Payouts;
using Microsoft.Extensions.DependencyInjection;
using Stripe;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents.EventHandlers;

[StripeEvent(EventTypes.TransferCreated)]
internal sealed class TransferCreatedHandler(
    PayoutRepository payoutRepository,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork) : StripeEventHandler<Transfer>
{
    public override async Task<Result> HandleAsync(Transfer transfer)
    {
        await MarkPayoutAsSentAsync(transfer);

        await unitOfWork.SaveChangesAsync();

        return Result.Success;
    }

    private async Task MarkPayoutAsSentAsync(Transfer transfer)
    {
        var payoutId = transfer.Get(MetadataKeys.PayoutId);

        var payout = await payoutRepository.GetByIdAsync(payoutId);
        payout!.MarkAsSent(transfer.Id);

        payoutRepository.Update(payout);
    }
}