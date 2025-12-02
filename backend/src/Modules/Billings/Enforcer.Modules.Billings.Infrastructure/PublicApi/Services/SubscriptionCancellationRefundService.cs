using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.Domain.RefundTransactions;
using Enforcer.Modules.Billings.Infrastructure.RefundTransactions;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Billings.Infrastructure.PublicApi.Services;

internal sealed class SubscriptionCancellationRefundService(
    RefundTransactionRepository refundRepository,
    IInvoiceRepository invoiceRepository,
    IStripeGateway stripeGateway,
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

        await refundRepository.AddAsync(refund, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        var refundResult = await stripeGateway.RefundAsync(refund, cancellationToken);

        if (refundResult.IsFailure)
        {
            refund.MarkAsFailed(refundResult.Error.Description);
            refundRepository.Update(refund);
            await unitOfWork.SaveChangesAsync(cancellationToken);
            return refundResult.Error;
        }

        return Result.Success;
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
            now);
    }
}
