using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.RefundTransactions;

public sealed class RefundTransaction : Entity
{
    public string RefundNumber { get; private set; } = null!;

    public Guid InvoiceId { get; private set; }
    public Guid PaymentId { get; private set; }
    public Guid ConsumerId { get; private set; }
    public Guid? ApprovedBy { get; private set; }

    public decimal RefundAmount { get; private set; }
    public string Currency { get; private set; } = null!;

    public RefundReason RefundReason { get; private set; }
    public string? ReasonDescription { get; private set; }

    public RefundStatus Status { get; private set; }

    public string? ProcessorRefundId { get; private set; }

    public DateTime RequestedAt { get; private set; }
    public DateTime? ProcessedAt { get; private set; }

    private RefundTransaction() { }
}