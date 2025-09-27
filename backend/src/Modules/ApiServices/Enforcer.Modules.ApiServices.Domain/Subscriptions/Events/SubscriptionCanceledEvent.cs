using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

public class SubscriptionCanceledEvent(Guid subscriptionId, Guid consumerId, Guid planId, DateTime? expiresAt) : DomainEvent
{
    public Guid SubscriptionId { get; } = subscriptionId;
    public Guid ConsumerId { get; } = consumerId;
    public Guid PlanId { get; } = planId;
    public DateTime? ExpiresAt { get; } = expiresAt;
}