using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

public class SubscriptionExpiredEvent(Guid subscriptionId, Guid consumerId, Guid planId, DateTime expiredAt) : DomainEvent
{
    public Guid SubscriptionId { get; } = subscriptionId;
    public Guid ConsumerId { get; } = consumerId;
    public Guid PlanId { get; } = planId;
    public DateTime ExpiredAt { get; } = expiredAt;
}
