using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

public class PlanPricingUpdatedEvent(Guid planId, int? price, BillingPeriod? billingPeriod, int? overagePrice, int? maxOverage) : DomainEvent
{
    public Guid PlanId { get; } = planId;
    public int? Price { get; } = price;
    public BillingPeriod? BillingPeriod { get; } = billingPeriod;
    public int? OveragePrice { get; } = overagePrice;
    public int? MaxOverage { get; } = maxOverage;
}
