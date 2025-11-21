using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Domain.PaymentMethods;
using Enforcer.Modules.Billings.Domain.Payments;
using Enforcer.Modules.Billings.Infrastructure.Invoices;
using Enforcer.Modules.Billings.Infrastructure.PaymentMethods;
using Enforcer.Modules.Billings.Infrastructure.Payments;
using Microsoft.Extensions.DependencyInjection;
using Stripe;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents.EventHandlers;

[StripeEvent(EventTypes.PaymentIntentSucceeded)]
internal sealed class PaymentIntentSucceededHandler(
    InvoiceRepository invoiceRepository,
    PaymentRepository paymentRepository,
    PaymentMethodRepository paymentMethodRepository,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork) : IStripeEventHandler
{
    public async Task<Result> HandleAsync(Event stripeEvent)
    {
        if (stripeEvent.Data.Object is not PaymentIntent paymentIntent)
            return Error.Validation();

        var consumerId = Guid.Parse("3FA85F64-5717-4562-B3FC-2C963F66AFA6");

        var invoiceId = paymentIntent.Metadata["InvoiceId"];

        Domain.Invoices.Invoice? invoice = await invoiceRepository.GetByIdAsync(Guid.Parse(invoiceId));
        invoice!.MarkAsPaid();

        invoiceRepository.Update(invoice);

        var paymentMethod = await paymentMethodRepository.GetByStripePaymentMethodId(paymentIntent.PaymentMethodId);

        if (paymentMethod is null)
        {
            var paymentIntentService = new PaymentIntentService();
            var options = new PaymentIntentGetOptions
            {
                Expand = ["payment_method"]
            };

            paymentIntent = await paymentIntentService.GetAsync(paymentIntent.Id, options);

            var card = paymentIntent.PaymentMethod.Card;

            paymentMethod = Domain.PaymentMethods.PaymentMethod.Create(
                consumerId,
                paymentIntent.CustomerId,
                paymentIntent.PaymentMethodId,
                PaymentMethodType.CreditCard,
                card.Fingerprint,
                card.Last4,
                card.Brand,
                card.ExpMonth,
                card.ExpYear,
                paymentIntent.PaymentMethod.BillingDetails.Address.ToJson(),
                true
            );

            await paymentMethodRepository.AddAsync(paymentMethod);
        }

        var payment = Payment.Create(
            invoice!.Id,
            consumerId,
            paymentMethod!.Id,
            paymentIntent.Id,
            paymentIntent.Amount,
            paymentIntent.Currency,
            PaymentStatus.Succeeded
        );

        await paymentRepository.AddAsync(payment);

        await unitOfWork.SaveChangesAsync();

        return Result.Success;
    }
}