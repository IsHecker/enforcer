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

        // 2. Check refund policy
        var refundAmount = RefundPolicyEvaluator.EvaluateRefundEligibility(
            subscription.SubscribedAt,
            subscription.ExpiresAt,
            invoice.Total);

        // 4. Create refund transaction
        var refund = RefundTransaction.Create(
            invoice.Id,
            invoice.ConsumerId,
            refundAmount,
            "USD");

        await refundRepository.AddAsync(refund, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // 5. Process refund with Stripe
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
        DateTime subscribedAt,
        DateTime? expiresAt,
        long amountPaid)
    {
        var now = DateTime.UtcNow;
        var daysSinceSubscribed = (now - subscribedAt).Days;
        var remainingDays = (expiresAt!.Value - now).Days;
        var totalDays = (expiresAt.Value - subscribedAt).Days;

        if (daysSinceSubscribed <= GracePeriodDays)
            return amountPaid;

        return ProrationCalculatorService.CalculateProrated(amountPaid, totalDays, remainingDays);
    }
}
