using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.PayoutTransactions;

public sealed class PayoutTransaction : Entity
{
    public Guid PayoutId { get; private set; }
    public Guid SubscriptionId { get; private set; }
    public Guid InvoiceId { get; private set; }
    public Guid ConsumerId { get; private set; }

    public string ConsumerName { get; private set; }
    public Guid ApiServiceId { get; private set; }
    public string ApiServiceName { get; private set; }
    public Guid PlanId { get; private set; }
    public string PlanName { get; private set; }

    public decimal RevenueAmount { get; private set; }
    public decimal PlatformFeeAmount { get; private set; }
    public decimal CreatorEarnings { get; private set; }

    public DateTime BillingCycleDate { get; private set; }

    private PayoutTransaction() { }
}