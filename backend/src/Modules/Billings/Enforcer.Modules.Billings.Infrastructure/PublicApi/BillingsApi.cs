using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.InvoiceLineItems;
using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.Domain.RefundTransactions;
using Enforcer.Modules.Billings.Infrastructure.PublicApi.Services;
using Enforcer.Modules.Billings.Infrastructure.RefundTransactions;
using Enforcer.Modules.Billings.PublicApi;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Billings.Infrastructure.PublicApi;

internal sealed class BillingsApi(
    IStripeGateway stripeGateway,
    IInvoiceRepository invoiceRepository,
    PlanSwitchBillingService planSwitchBillingService,
    SubscriptionCancellationRefundService subscriptionCancellationRefundService,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork) : IBillingsApi
{
    public async Task<string> CreateSubscriptionCheckoutSessionAsync(
        Guid consumerId,
        SubscriptionResponse subscription,
        PlanResponse plan,
        string returnUrl,
        CancellationToken cancellationToken = default)
    {
        var invoice = await CreateInvoiceAsync(
            consumerId,
            subscription,
            plan,
            cancellationToken);

        return await stripeGateway.CreateCheckoutSessionAsync(
            "cus_TQhMgiqIy35WS7",
            invoice,
            returnUrl,
            cancellationToken);
    }

    private async Task<Invoice> CreateInvoiceAsync(
        Guid consumerId,
        SubscriptionResponse subscription,
        PlanResponse plan,
        CancellationToken cancellationToken)
    {
        var lineItem = InvoiceLineItem.Create(
            InvoiceItemType.Subscription,
            $"{plan.Name} - Subscription",
            plan.PriceInCents);

        var invoice = Invoice.Create(
            consumerId,
            "USD",
            subscription.Id,
            DateTime.UtcNow,
            subscription.ExpiresAt);

        invoice.AddLineItem(lineItem);

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