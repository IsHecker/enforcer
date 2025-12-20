using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Infrastructure.Refunds;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents.EventHandlers;

[StripeEvent(Stripe.EventTypes.RefundUpdated)]
internal sealed class RefundUpdatedHandler(
    RefundRepository refundRepository,
    IInvoiceRepository invoiceRepository,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork) : StripeEventHandler<Stripe.Refund>
{
    public override async Task<Result> HandleAsync(Stripe.Refund stripeRefund)
    {
        if (stripeRefund.Status != "succeeded")
            return Result.Success;

        var refundId = stripeRefund.Get(MetadataKeys.RefundId);

        var refund = await refundRepository.GetByIdAsync(refundId);
        if (refund is null)
            return Error.Failure();

        refund.MarkAsProcessed(stripeRefund.Id);
        refundRepository.Update(refund);

        var invoice = await invoiceRepository.GetByIdAsync(refund.InvoiceId);
        if (invoice is null)
            return Error.Failure();

        if (refund.Amount == invoice.Total)
        {
            invoice.MarkAsRefunded();
        }
        else
        {
            invoice.MarkAsPartiallyRefunded();
        }

        invoiceRepository.Update(invoice);
        await unitOfWork.SaveChangesAsync();

        return Result.Success;
    }
}