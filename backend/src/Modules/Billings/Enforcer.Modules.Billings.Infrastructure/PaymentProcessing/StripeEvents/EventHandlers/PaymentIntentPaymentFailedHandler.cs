using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Domain.Payments;
using Enforcer.Modules.Billings.Infrastructure.Invoices;
using Enforcer.Modules.Billings.Infrastructure.Payments;
using Microsoft.Extensions.DependencyInjection;
using Stripe;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents.EventHandlers;

[StripeEvent(EventTypes.PaymentIntentPaymentFailed)]
internal sealed class PaymentIntentPaymentFailedHandler(
    InvoiceRepository invoiceRepository,
    PaymentRepository paymentRepository,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork) : StripeEventHandler<PaymentIntent>
{
    public override async Task<Result> HandleAsync(PaymentIntent paymentIntent)
    {
        var consumerId = SharedData.UserId;

        var invoiceId = paymentIntent.Get(MetadataKeys.InvoiceId);

        if (paymentIntent.IsCheckoutMode())
        {
            await invoiceRepository.DeleteAsync(invoiceId);
            return Result.Success;
        }

        var paymentMethodId = paymentIntent.Get(MetadataKeys.PaymentMethodId);

        var payment = Payment.Create(
            invoiceId,
            consumerId,
            paymentMethodId,
            paymentIntent.Id,
            paymentIntent.Amount,
            paymentIntent.Currency,
            PaymentStatus.Failed,
            paymentIntent.LastPaymentError.Code,
            paymentIntent.LastPaymentError.Message
        );

        await paymentRepository.AddAsync(payment);

        await unitOfWork.SaveChangesAsync();

        return Result.Success;
    }
}