using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Contracts;
using Enforcer.Modules.Billings.Infrastructure.Invoicing;
using Enforcer.Modules.Billings.Infrastructure.PromotionalCodes;
using Enforcer.Modules.Billings.Infrastructure.Services;
using Enforcer.Modules.Billings.Infrastructure.WalletEntries;
using Enforcer.Modules.Billings.PublicApi;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Billings.Infrastructure.PublicApi;

internal sealed class BillingsApi(
    IStripeGateway stripeGateway,
    IInvoiceRepository invoiceRepository,
    IWalletRepository walletRepository,
    WalletEntryRepository entryRepository,
    PlanSwitchBillingService planSwitchBillingService,
    SubscriptionCancellationRefundService subscriptionCancellationRefundService,
    PromoCodeService promoCodeService,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork) : IBillingsApi
{
    public async Task<Result<PaymentIntentResponse>> InitializePaymentAsync(
        Guid consumerId,
        Guid creatorId,
        DateTime? subscriptionExpiresAt,
        PlanResponse plan,
        string promoCode,
        CancellationToken cancellationToken = default)
    {
        var discountAmount = 0L;
        string? discountDescription = null;

        if (promoCode is not null)
        {
            var promoResult = await promoCodeService.ApplyPromoCodeAsync(
                promoCode, consumerId, plan.PriceInCents, cancellationToken);

            if (promoResult.IsFailure)
                return promoResult.Error;

            (discountAmount, discountDescription) = promoResult.Value;
        }

        var wallet = await walletRepository.GetByUserIdAsync(consumerId, cancellationToken);
        var walletCreditUsed = 0L;

        if (wallet is not null)
        {
            var invoiceSubtotal = plan.PriceInCents - discountAmount;
            var chargeResult = wallet.Charge(invoiceSubtotal, Guid.Empty);

            if (chargeResult.IsSuccess)
                walletCreditUsed = chargeResult.Value;
        }

        var invoice = InvoiceFactory.ForSubscription(
            consumerId,
            plan,
            subscriptionExpiresAt,
            discountAmount,
            discountDescription,
            walletCreditUsed);

        if (walletCreditUsed > 0)
            await entryRepository.AddRangeAsync(wallet!.Entries, cancellationToken);

        await invoiceRepository.AddAsync(invoice, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        var clientSecret = await stripeGateway.InitializePaymentIntentAsync(
            SharedData.CustomerId,
            invoice,
            creatorId,
            consumerId,
            plan.Id,
            cancellationToken);

        return new PaymentIntentResponse(clientSecret);
    }

    public async Task<Result<PaymentIntentResponse>> ProcessRenewalBillingAsync(
        Guid creatorId,
        SubscriptionResponse subscription,
        CancellationToken cancellationToken = default)
    {
        var invoice = InvoiceFactory.ForRenewal(subscription);

        await invoiceRepository.AddAsync(invoice, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        var clientSecret = await stripeGateway.InitializePaymentIntentAsync(
            SharedData.CustomerId,
            invoice,
            creatorId,
            subscription.ConsumerId,
            subscription.Plan.Id,
            cancellationToken);

        return new PaymentIntentResponse(clientSecret);
    }

    public Task<Result> ProcessCancellationRefundAsync(
        SubscriptionResponse subscription,
        CancellationToken cancellationToken = default)
    {
        return subscriptionCancellationRefundService.ProcessCancellationRefundAsync(subscription, cancellationToken);
    }

    public Task<Result<PaymentIntentResponse>> ProcessPlanSwitchBillingAsync(
        Guid creatorId,
        SubscriptionResponse subscription,
        PlanResponse targetPlan,
        CancellationToken cancellationToken = default)
    {
        return planSwitchBillingService.ProcessBillingAsync(creatorId, subscription, targetPlan, cancellationToken);
    }
}