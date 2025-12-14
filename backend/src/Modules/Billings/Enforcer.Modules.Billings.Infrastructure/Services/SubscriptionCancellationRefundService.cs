using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.Domain.RefundTransactions;
using Enforcer.Modules.Billings.Infrastructure.Payments;
using Enforcer.Modules.Billings.Infrastructure.RefundTransactions;
using Enforcer.Modules.Billings.Infrastructure.WalletEntries;
using Enforcer.Modules.Billings.Infrastructure.Wallets;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Billings.Infrastructure.Services;

internal sealed class SubscriptionCancellationRefundService(
    IInvoiceRepository invoiceRepository,
    RefundTransactionRepository refundRepository,
    PaymentRepository paymentRepository,
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

        var refundAmount = RefundPolicyEvaluator.EvaluateRefundEligibility(subscription, invoice.Total);

        var refund = RefundTransaction.Create(
            invoice.Id,
            invoice.ConsumerId,
            refundAmount,
            "USD");

        await RefundToCreditsAsync(refund);

        await refundRepository.AddAsync(refund, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success;
    }

    private async Task RefundToCreditsAsync(RefundTransaction refund)
    {
        var wallet = await walletRepository.GetByUserIdAsync(refund.ConsumerId);
        var payment = await paymentRepository.GetByIdAsync(refund.PaymentId);

        wallet!.AddCredit(refund.Amount, refund.InvoiceId);
        payment!.MarkAsRefund(refund.Amount);

        await walletEntryRepository.AddRangeAsync(wallet.Entries);
        paymentRepository.Update(payment);
    }
}

internal sealed class RefundPolicyEvaluator
{
    private const int GracePeriodDays = 7;

    public static long EvaluateRefundEligibility(
        SubscriptionResponse subscription,
        long amountPaid)
    {
        var now = DateTime.UtcNow;
        var daysSinceSubscribed = (now - subscription.SubscribedAt).Days;

        if (daysSinceSubscribed <= GracePeriodDays)
            return amountPaid;

        return ProrationCalculatorService.CalculateProrated(
            amountPaid,
            subscription.Plan.BillingPeriod!,
            subscription.ExpiresAt!.Value,
            now).Amount;
    }
}