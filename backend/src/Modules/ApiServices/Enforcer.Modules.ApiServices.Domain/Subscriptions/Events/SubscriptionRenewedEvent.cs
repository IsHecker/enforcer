using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

public class SubscriptionRenewedEvent(
    Guid subscriptionId,
    Guid consumerId,
    Guid planId,
    DateTime newExpiration) : DomainEvent
{
    public Guid SubscriptionId { get; } = subscriptionId;
    public Guid ConsumerId { get; } = consumerId;
    public Guid PlanId { get; } = planId;
    public DateTime NewExpiration { get; } = newExpiration;
}
