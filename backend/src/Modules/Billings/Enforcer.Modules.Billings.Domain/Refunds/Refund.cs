using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.Refunds;

public sealed class Refund : Entity
{
    public string RefundNumber { get; private set; }

    public Guid InvoiceId { get; private set; }
    public Guid PaymentId { get; private set; }
    public Guid ConsumerId { get; private set; }

    public long Amount { get; private set; }
    public string Currency { get; private set; } = null!;

    public RefundType Type { get; private set; }

    public string? Description { get; private set; }

    public RefundStatus Status { get; private set; }

    public string? StripeRefundId { get; private set; }
    public string? FailureReason { get; private set; }

    public DateTime RequestedAt { get; private set; }
    public DateTime? ProcessedAt { get; private set; }

    private Refund() { }

    public static Refund Create(
        Guid invoiceId,
        Guid consumerId,
        long amount,
        string currency,
        RefundType type,
        Guid? paymentId = null,
        string? description = null)
    {
        return new Refund
        {
            RefundNumber = GenerateRefundNumber(),
            InvoiceId = invoiceId,
            PaymentId = paymentId.GetValueOrDefault(),
            ConsumerId = consumerId,
            Amount = amount,
            Currency = currency,
            Type = type,
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