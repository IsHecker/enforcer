using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.PaymentSchedules;

public class PaymentSchedule : Entity
{
    public Guid SubscriptionId { get; private set; }
    public Guid ConsumerId { get; private set; }
    public Guid? InvoiceId { get; private set; }
    public Guid? PaymentId { get; private set; }

    public DateTime ScheduledDate { get; private set; }
    public decimal ExpectedAmount { get; private set; }

    public PaymentScheduleStatus Status { get; private set; }

    public int AttemptCount { get; private set; }
    public DateTime? LastAttemptAt { get; private set; }
    public DateTime? NextRetryAt { get; private set; }

    private PaymentSchedule() { }
}