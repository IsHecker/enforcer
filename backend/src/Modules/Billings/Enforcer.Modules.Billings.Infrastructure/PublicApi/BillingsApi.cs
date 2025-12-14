using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Contracts;
using Enforcer.Modules.Billings.Domain.InvoiceLineItems;
using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.Infrastructure.PromotionalCodes;
using Enforcer.Modules.Billings.Infrastructure.Services;
using Enforcer.Modules.Billings.PublicApi;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Billings.Infrastructure.PublicApi;

internal sealed class BillingsApi(
    IStripeGateway stripeGateway,
    IInvoiceRepository invoiceRepository,
    PlanSwitchBillingService planSwitchBillingService,
    SubscriptionCancellationRefundService subscriptionCancellationRefundService,
    PromoCodeService promoCodeService,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork) : IBillingsApi
{
    public async Task<Result<CheckoutSessionResponse>> CreateSubscriptionCheckoutSessionAsync(
        Guid consumerId,
        Guid creatorId,
        SubscriptionResponse subscription,
        PlanResponse plan,
        string promoCode,
        string returnUrl,
        CancellationToken cancellationToken = default)
    {
        var invoiceResult = await CreateInvoiceAsync(
            consumerId,
            subscription,
            plan,
            promoCode,
            cancellationToken);

        if (invoiceResult.IsFailure)
            return invoiceResult.Error;

        var checkoutUrl = await stripeGateway.CreateCheckoutSessionAsync(
            SharedData.CustomerId,
            invoiceResult.Value,
            creatorId,
            consumerId,
            plan.Id,
            returnUrl,
            cancellationToken);

        return new CheckoutSessionResponse(checkoutUrl);
    }

    private async Task<Result<Invoice>> CreateInvoiceAsync(
        Guid consumerId,
        SubscriptionResponse subscription,
        PlanResponse plan,
        string code,
        CancellationToken cancellationToken)
    {
        var invoice = Invoice.Create(
            consumerId,
            "USD",
            billingPeriodStart: DateTime.UtcNow,
            billingPeriodEnd: subscription.ExpiresAt);

        var subscriptionLineItem = InvoiceLineItem.Create(
            InvoiceItemType.Subscription,
            $"{plan.Name} - Subscription",
            plan.PriceInCents);

        invoice.AddLineItem(subscriptionLineItem);

        var discountResult = await promoCodeService.ApplyPromoCodeAsync(
            code,
            consumerId,
            invoice.Total,
            cancellationToken);

        if (discountResult.IsFailure)
            return discountResult.Error;

        invoice.AddLineItem(discountResult.Value);

        await invoiceRepository.AddAsync(invoice, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return invoice;
    }

    public Task<Result> ProcessCancellationRefundAsync(
        SubscriptionResponse subscription,
        CancellationToken cancellationToken = default)
    {
        return subscriptionCancellationRefundService.ProcessCancellationRefundAsync(subscription, cancellationToken);
    }

    public Task<Result> ProcessPlanSwitchBillingAsync(
        SubscriptionResponse subscription,
        PlanResponse targetPlan,
        CancellationToken cancellationToken = default)
    {
        return planSwitchBillingService.ProcessBillingAsync(subscription, targetPlan, cancellationToken);
    }
}