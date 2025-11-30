using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.RefundTransactions;

public sealed class RefundTransaction : Entity
{
    public string RefundNumber { get; private set; }

    public Guid InvoiceId { get; private set; }
    public Guid PaymentId { get; private set; }
    public Guid ConsumerId { get; private set; }

    public long Amount { get; private set; }
    public string Currency { get; private set; } = null!;

    public string? Description { get; private set; }

    public RefundStatus Status { get; private set; }

    public string? StripeRefundId { get; private set; }
    public string? FailureReason { get; private set; }

    public DateTime RequestedAt { get; private set; }
    public DateTime? ProcessedAt { get; private set; }

    private RefundTransaction() { }

    public static RefundTransaction Create(
        Guid invoiceId,
        Guid consumerId,
        long amount,
        string currency,
        string? description = null)
    {
        return new RefundTransaction
        {
            RefundNumber = GenerateRefundNumber(),
            InvoiceId = invoiceId,
            ConsumerId = consumerId,
            Amount = amount,
            Currency = currency,
            Description = description,
            Status = RefundStatus.Pending,
            RequestedAt = DateTime.UtcNow
        };
    }

    public void MarkAsProcessed(string stripeRefundId)
    {
        Status = RefundStatus.Completed;
        StripeRefundId = stripeRefundId;
        ProcessedAt = DateTime.UtcNow;
    }

    public void MarkAsFailed(string failureReason)
    {
        Status = RefundStatus.Failed;
        FailureReason = failureReason;
        ProcessedAt = DateTime.UtcNow;
    }

    private static string GenerateRefundNumber() =>
        $"RFD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}";
}