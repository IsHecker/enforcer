using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.ApiServices.PublicApi;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.InvoiceLineItems;
using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.Domain.PaymentMethods;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.SubscriptionRenewal;

internal sealed class SubscriptionRenewalService(
    IStripeGateway stripeGateway,
    IInvoiceRepository invoiceRepository,
    IApiServicesApi servicesApi,
    IPaymentMethodRepository paymentMethodRepository,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork,
    ILogger<SubscriptionRenewalService> logger)
{
    public async Task<Result> RenewAsync(SubscriptionResponse subscription, CancellationToken cancellationToken)
    {
        var invoice = await CreateInvoiceAsync(subscription, cancellationToken);

        var chargeResult = await stripeGateway.ChargeAsync(
            invoice,
            cancellationToken: cancellationToken);

        if (!chargeResult.IsSuccess)
        {
            var error = chargeResult.Error;

            logger.LogWarning(
                "Renewal charge failed for subscription {SubscriptionId}: {ErrorCode} - {ErrorMessage}",
                subscription.Id,
                error.Code,
                error.Description);

            return error;
        }

        await servicesApi.RenewSubscription(subscription.Id, cancellationToken);

        return Result.Success;
    }

    private async Task<Invoice> CreateInvoiceAsync(SubscriptionResponse subscription, CancellationToken cancellationToken)
    {
        var invoice = Invoice.Create(
            subscription.ConsumerId,
            "USD",
            subscription.Id,
            DateTime.UtcNow,
            subscription.ExpiresAt);

        var subscriptionLineItem = InvoiceLineItem.Create(
            InvoiceItemType.Subscription,
            $"{subscription.Plan.Name} - Renewal",
            subscription.Plan.PriceInCents);

        invoice.AddLineItem(subscriptionLineItem);

        if (subscription.ApiUsage.OverageUsed > 0 &&
            subscription.Plan.OveragePriceInCents.HasValue)
        {
            var overageLineItem = InvoiceLineItem.Create(
                InvoiceItemType.Overage,
                $"Overage: {subscription.ApiUsage.OverageUsed} additional API calls",
                subscription.Plan.OveragePriceInCents.Value,
                subscription.ApiUsage.OverageUsed);

            invoice.AddLineItem(overageLineItem);
        }

        await invoiceRepository.AddAsync(invoice, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return invoice;
    }
}