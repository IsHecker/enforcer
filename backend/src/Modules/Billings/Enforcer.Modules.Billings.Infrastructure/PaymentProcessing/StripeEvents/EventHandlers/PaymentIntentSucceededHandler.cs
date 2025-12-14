using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.PublicApi;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.PaymentMethods;
using Enforcer.Modules.Billings.Domain.Payments;
using Enforcer.Modules.Billings.Infrastructure.Payments;
using Enforcer.Modules.Billings.Infrastructure.Payouts;
using Enforcer.Modules.Billings.Infrastructure.WalletEntries;
using Enforcer.Modules.Billings.Infrastructure.Wallets;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Stripe;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents.EventHandlers;

[StripeEvent(EventTypes.PaymentIntentSucceeded)]
internal sealed class PaymentIntentSucceededHandler(
    IOptions<PayoutOptions> options,
    IApiServicesApi servicesApi,
    IInvoiceRepository invoiceRepository,
    IPaymentMethodRepository paymentMethodRepository,
    PaymentRepository paymentRepository,
    WalletRepository walletRepository,
    WalletEntryRepository walletEntryRepository,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork) : StripeEventHandler<PaymentIntent>
{
    private readonly PayoutOptions _payoutOptions = options.Value;

    public override async Task<Result> HandleAsync(PaymentIntent paymentIntent)
    {
        var consumerId = SharedData.UserId;

        var invoice = await MarkInvoiceAsPaidAsync(paymentIntent);

        if (paymentIntent.IsCheckoutMode())
            await CreateSubscription(paymentIntent, invoice);

        var paymentMethod = await GetOrCreatePaymentMethodAsync(paymentIntent, consumerId);

        var payment = await RecordPaymentAsync(paymentIntent, invoice, paymentMethod, consumerId);

        if (paymentIntent.TryGet(MetadataKeys.CreatorId, out var creatorId))
            await RecordEarningAsync(payment, creatorId);

        await unitOfWork.SaveChangesAsync();

        return Result.Success;
    }

    private async Task<Domain.Invoices.Invoice> MarkInvoiceAsPaidAsync(PaymentIntent paymentIntent)
    {
        paymentIntent.TryGet(MetadataKeys.InvoiceId, out var invoiceId);

        var invoice = await invoiceRepository.GetByIdAsync(invoiceId)
            ?? throw new InvalidOperationException("Invoice not found");

        invoice.MarkAsPaid();
        invoiceRepository.Update(invoice);

        return invoice;
    }

    private async Task CreateSubscription(PaymentIntent paymentIntent, Domain.Invoices.Invoice invoice)
    {
        var consumerId = paymentIntent.Get(MetadataKeys.ConsumerId);
        var planId = paymentIntent.Get(MetadataKeys.PlanId);

        var subscriptionId = await servicesApi.CreateSubscriptionAsync(consumerId, planId);

        invoice.SetSubscriptionId(subscriptionId);
    }

    private async Task<Domain.PaymentMethods.PaymentMethod?> GetOrCreatePaymentMethodAsync(
        PaymentIntent paymentIntent,
        Guid consumerId)
    {
        var existingMethod = await paymentMethodRepository
            .GetByStripePaymentMethodId(paymentIntent.PaymentMethodId);

        if (existingMethod is not null)
            return existingMethod;

        if (!IsSaveAllowed(paymentIntent))
            return null;

        return await CreatePaymentMethodAsync(paymentIntent, consumerId);
    }

    private async Task<Domain.PaymentMethods.PaymentMethod> CreatePaymentMethodAsync(
        PaymentIntent paymentIntent,
        Guid consumerId)
    {
        var stripePaymentMethod = await new PaymentMethodService()
            .GetAsync(paymentIntent.PaymentMethodId);

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
            stripePaymentMethod.BillingDetails.Address.ToJson());

        paymentMethod.SetAsDefault();
        await paymentMethodRepository.AddAsync(paymentMethod);

        return paymentMethod;
    }

    private async Task<Payment> RecordPaymentAsync(
        PaymentIntent paymentIntent,
        Domain.Invoices.Invoice invoice,
        Domain.PaymentMethods.PaymentMethod? paymentMethod,
        Guid consumerId)
    {
        var payment = Payment.Create(
            invoice.Id,
            consumerId,
            paymentMethod?.Id,
            paymentIntent.Id,
            paymentIntent.Amount,
            paymentIntent.Currency,
            PaymentStatus.Succeeded
        );

        await paymentRepository.AddAsync(payment);
        return payment;
    }

    private async Task RecordEarningAsync(Payment payment, Guid creatorId)
    {
        var wallet = await walletRepository.GetByUserIdAsync(creatorId)
            ?? throw new InvalidOperationException("Wallet not found");

        wallet.AddEarnings(payment.Id, payment.Amount, _payoutOptions.PlatformFeePercentage);
        await walletEntryRepository.AddRangeAsync(wallet.Entries);
    }

    private static bool IsSaveAllowed(PaymentIntent paymentIntent)
        => paymentIntent.SetupFutureUsage == "off_session";
}