using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.Billings.Domain.Payouts;

public class Payout : Entity
{
    public string PayoutNumber { get; private set; }

    public Guid CreatorId { get; private set; }

    public long TotalAmount { get; private set; }
    public string Currency { get; private set; }
    public string? Description { get; private set; }

    public string? StripeTransferId { get; private set; } // stripe connect payout ID

    public PayoutStatus Status { get; private set; }

    public DateTime PeriodStart { get; private set; }
    public DateTime PeriodEnd { get; private set; }

    public DateTime ScheduledDate { get; private set; }
    public DateTime? SentAt { get; private set; }

    public string? FailureReason { get; private set; }

    private Payout() { }

    public static Result<Payout> Create(
        Guid creatorId,
        long totalAmount,
        DateTime periodStart,
        DateTime periodEnd,
        string currency = "USD",
        string? description = null)
    {
        if (totalAmount < 0)
            return PayoutErrors.InvalidTotalAmound;

        if (periodEnd < periodStart)
            throw new ArgumentException("PeriodEnd cannot be before PeriodStart.");

        return new Payout
        {
            PayoutNumber = GeneratePayoutNumber(),

            CreatorId = creatorId,
            TotalAmount = totalAmount,
            Currency = currency,
            Description = description,

            Status = PayoutStatus.Processing,

            PeriodStart = periodStart,
            PeriodEnd = periodEnd,

            ScheduledDate = DateTime.UtcNow,
            SentAt = null,
            StripeTransferId = null,
            FailureReason = null
        };
    }

    public void MarkAsSent(string stripeTransferId)
    {
        StripeTransferId = stripeTransferId;
        Status = PayoutStatus.Sent;
    }

    public void MarkAsFailed(string failureReason)
    {
        FailureReason = failureReason;
        Status = PayoutStatus.Failed;
    }

    private static string GeneratePayoutNumber() =>
        $"Payout-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}";
}