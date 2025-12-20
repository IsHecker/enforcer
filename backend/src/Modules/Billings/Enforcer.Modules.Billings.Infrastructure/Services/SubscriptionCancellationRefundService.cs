using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.Domain.Refunds;
using Enforcer.Modules.Billings.Infrastructure.Refunds;
using Enforcer.Modules.Billings.Infrastructure.WalletEntries;
using Enforcer.Modules.Billings.Infrastructure.Wallets;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Billings.Infrastructure.Services;

internal sealed class SubscriptionCancellationRefundService(
    IInvoiceRepository invoiceRepository,
    IStripeGateway stripeGateway,
    RefundRepository refundRepository,
    WalletRepository walletRepository,
    WalletEntryRepository walletEntryRepository,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork)
{
    public async Task<Result> ProcessCancellationRefundAsync(
        SubscriptionResponse subscription,
        CancellationToken cancellationToken = default)
    {
        var invoice = await invoiceRepository.GetLastPaidBySubscriptionIdAsync(subscription.Id, cancellationToken);
        if (invoice is null)
            return Error.NotFound(
                "Invoice.NotFound",
                $"The invoice with Subscription Id '{subscription.Id}' was not found.");

        if (invoice.Status != InvoiceStatus.Paid)
            return Error.Validation("Invoice.NotPaid", "Can only refund paid invoices");

        var refundDecision = RefundPolicyEvaluator.EvaluateRefundEligibility(subscription, invoice.Total);

        var refund = Refund.Create(
            invoice.Id,
            invoice.ConsumerId,
            refundDecision.Amount,
            "USD",
            refundDecision.Type);

        if (refundDecision.Type == RefundType.FullRefund)
        {
            await stripeGateway.RefundAsync(refund, cancellationToken);
        }
        else
        {
            await RefundToCreditsAsync(refund);
        }

        await refundRepository.AddAsync(refund, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success;
    }

    private async Task RefundToCreditsAsync(Refund refund)
    {
        // TODO: refactor to refund service

        var wallet = await walletRepository.GetByUserIdAsync(refund.ConsumerId);

        wallet!.AddCredit(refund.Amount, refund.InvoiceId);

        await walletEntryRepository.AddRangeAsync(wallet.Entries);
    }
}

internal sealed class RefundPolicyEvaluator
{
    private const int GracePeriodDays = 7;

    public static RefundDecision EvaluateRefundEligibility(
        SubscriptionResponse subscription,
        long amountPaid)
    {
        var now = DateTime.UtcNow;
        var daysSinceSubscribed = (now - subscription.SubscribedAt).Days;

        if (daysSinceSubscribed <= GracePeriodDays)
            return new(RefundType.FullRefund, amountPaid);

        var creditAmount = ProrationCalculatorService.CalculateProrated(
            amountPaid,
            subscription.Plan.BillingPeriod!,
            subscription.ExpiresAt!.Value,
            now).Amount;

        return new(RefundType.Credit, creditAmount);
    }

    public readonly record struct RefundDecision(RefundType Type, long Amount);
}