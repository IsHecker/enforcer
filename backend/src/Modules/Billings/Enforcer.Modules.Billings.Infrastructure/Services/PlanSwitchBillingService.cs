using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Contracts;
using Enforcer.Modules.Billings.Infrastructure.Invoicing;
using Enforcer.Modules.Billings.Infrastructure.WalletEntries;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Billings.Infrastructure.Services;

internal sealed class PlanSwitchBillingService(
    IStripeGateway stripeGateway,
    IInvoiceRepository invoiceRepository,
    IWalletRepository walletRepository,
    WalletEntryRepository walletEntryRepository,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork)
{
    public async Task<Result<PaymentIntentResponse>> ProcessBillingAsync(
        Guid creatorId,
        SubscriptionResponse subscription,
        PlanResponse targetPlan,
        CancellationToken cancellationToken = default)
    {
        var invoice = InvoiceFactory.ForPlanSwitch(
            subscription,
            targetPlan,
            DateTime.UtcNow);

        if (invoice.Total > 0)
        {
            return await ProcessCheckoutAsync(invoice, creatorId, targetPlan.Id, cancellationToken);
        }

        invoice.Pay();
        await invoiceRepository.AddAsync(invoice, cancellationToken);

        if (invoice.Total < 0)
            await RefundToCreditsAsync(invoice);

        await unitOfWork.SaveChangesAsync(cancellationToken);
        return new PaymentIntentResponse(null);
    }

    private async Task<Result<PaymentIntentResponse>> ProcessCheckoutAsync(
        Domain.Invoices.Invoice invoice,
        Guid creatorId,
        Guid planId,
        CancellationToken cancellationToken)
    {
        await invoiceRepository.AddAsync(invoice, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        var clientSecret = await stripeGateway.InitializePaymentIntentAsync(
            SharedData.CustomerId,
            invoice,
            creatorId,
            SharedData.UserId, // Assuming ConsumerId is current user
            planId,
            cancellationToken);

        return new PaymentIntentResponse(clientSecret);
    }

    private async Task RefundToCreditsAsync(Domain.Invoices.Invoice invoice)
    {
        var wallet = await walletRepository.GetByUserIdAsync(invoice.ConsumerId);
        wallet!.AddCredit(Math.Abs(invoice.Total), invoice.Id);
        await walletEntryRepository.AddRangeAsync(wallet.Entries);
    }
}