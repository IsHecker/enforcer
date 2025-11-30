using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.PublicApi;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.PaymentMethods;
using Enforcer.Modules.Billings.Domain.Payments;
using Enforcer.Modules.Billings.Infrastructure.Payments;
using Microsoft.Extensions.DependencyInjection;
using Stripe;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents.EventHandlers;

[StripeEvent(EventTypes.PaymentIntentSucceeded)]
internal sealed class PaymentIntentSucceededHandler(
    IApiServicesApi servicesApi,
    IInvoiceRepository invoiceRepository,
    IPaymentMethodRepository paymentMethodRepository,
    PaymentRepository paymentRepository,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork) : StripeEventHandler<PaymentIntent>
{
    public override async Task<Result> HandleAsync(PaymentIntent paymentIntent)
    {
        var consumerId = Guid.Parse("3FA85F64-5717-4562-B3FC-2C963F66AFA6");

        var invoiceId = paymentIntent.Metadata["InvoiceId"];

        Domain.Invoices.Invoice? invoice = await invoiceRepository.GetByIdAsync(Guid.Parse(invoiceId));
        invoice!.MarkAsPaid();

        invoiceRepository.Update(invoice);

        if (paymentIntent.Metadata.TryGetValue("CheckoutMode", out var _))
        {
            await servicesApi.ActivateSubscription(invoice.SubscriptionId.GetValueOrDefault());
        }

        var paymentMethod = await paymentMethodRepository.GetByStripePaymentMethodId(paymentIntent.PaymentMethodId);

        if (paymentMethod is null && IsSaveAllowed(paymentIntent))
            paymentMethod = await CreatePaymentMethodAsync(paymentIntent, consumerId);

        var payment = Payment.Create(
            invoice!.Id,
            consumerId,
            paymentMethod?.Id,
            paymentIntent.Id,
            paymentIntent.Amount,
            paymentIntent.Currency,
            PaymentStatus.Succeeded
        );

        await paymentRepository.AddAsync(payment);

        await unitOfWork.SaveChangesAsync();

        return Result.Success;
    }

    private static bool IsSaveAllowed(PaymentIntent paymentIntent) => paymentIntent.SetupFutureUsage == "off_session";

    private async Task<Domain.PaymentMethods.PaymentMethod> CreatePaymentMethodAsync(
        PaymentIntent paymentIntent,
        Guid consumerId)
    {
        var stripePaymentMethod = await new PaymentMethodService().GetAsync(paymentIntent.PaymentMethodId);

        var card = stripePaymentMethod.Card;

        var paymentMethod = Domain.PaymentMethods.PaymentMethod.Create(
            consumerId,
            paymentIntent.CustomerId,
            stripePaymentMethod.Id,
            PaymentMethodType.CreditCard,
            card.Fingerprint,
            card.Last4,
            card.Brand,
            card.ExpMonth,
            card.ExpYear,
            stripePaymentMethod.BillingDetails.Address.ToJson()
        );

        paymentMethod.SetAsDefault();

        await paymentMethodRepository.AddAsync(paymentMethod);
        return paymentMethod;
    }
}