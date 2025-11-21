using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Modules.Billings.Domain.Payments;

namespace Enforcer.Modules.Billings.Domain.BillingCycles;

public sealed class BillingCycle : Entity
{
    public Guid SubscriptionId { get; private set; }
    public int CycleNumber { get; private set; }
    public DateTime CycleStart { get; private set; }
    public DateTime CycleEnd { get; private set; }

    // Usage Tracking
    public int RequestsUsed { get; private set; }
    public int QuotaLimit { get; private set; }
    public int OverageRequests { get; private set; }

    // Financial
    public decimal PlanPrice { get; private set; }
    public decimal OverageCharges { get; private set; }
    public decimal TotalCharge { get; private set; }

    public PaymentStatus PaymentStatus { get; private set; }

    private BillingCycle() { }
}