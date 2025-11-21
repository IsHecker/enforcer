using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Domain.Payments;
using Enforcer.Modules.Billings.Infrastructure.Invoices;
using Enforcer.Modules.Billings.Infrastructure.PaymentMethods;
using Enforcer.Modules.Billings.Infrastructure.Payments;
using Microsoft.Extensions.DependencyInjection;
using Stripe;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents.EventHandlers;

[StripeEvent(EventTypes.PaymentIntentPaymentFailed)]
internal sealed class PaymentIntentPaymentFailedHandler(
    InvoiceRepository invoiceRepository,
    PaymentRepository paymentRepository,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork) : IStripeEventHandler
{
    public async Task<Result> HandleAsync(Event stripeEvent)
    {
        if (stripeEvent.Data.Object is not PaymentIntent paymentIntent)
            return Error.Validation();

        var consumerId = Guid.Parse("3FA85F64-5717-4562-B3FC-2C963F66AFA6");

        var invoiceId = paymentIntent.Metadata["InvoiceId"];

        if (paymentIntent.Metadata.TryGetValue("CheckoutMode", out var _))
        {
            await invoiceRepository.DeleteAsync(Guid.Parse(invoiceId));
            return Result.Success;
        }

        var paymentMethodId = paymentIntent.Metadata["PaymentMethodId"];

        var payment = Payment.Create(
            Guid.Parse(invoiceId),
            consumerId,
            Guid.Parse(paymentMethodId),
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