using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.Payouts;

public class Payout : Entity
{
    public Guid CreatorId { get; private set; }

    public string PayoutNumber { get; private set; }

    public decimal Amount { get; private set; }
    public string Currency { get; private set; }
    public decimal PlatformFee { get; private set; }
    public decimal PlatformFeePercentage { get; private set; }
    public decimal NetAmount { get; private set; }
    public bool MeetsMinimumThreshold { get; private set; }

    public DateTime PeriodStart { get; private set; }
    public DateTime PeriodEnd { get; private set; }

    public PayoutStatus Status { get; private set; }
    public bool IsOnHold { get; private set; }
    public string? HoldReason { get; private set; }

    public PayoutPaymentMethod PaymentMethod { get; private set; }
    public string? ProcessorPayoutId { get; private set; }

    public DateTime ScheduledDate { get; private set; }
    public DateTime? ProcessedDate { get; private set; }

    public string Description { get; private set; }
    public string TransactionId { get; private set; }

    public string? FailureReason { get; private set; }

    private Payout() { }
}