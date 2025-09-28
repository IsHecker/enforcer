using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

public class SubscriptionCanceledEvent(Guid subscriptionId, Guid apiServiceId, Guid planId, DateTime? expiresAt) : DomainEvent
{
    public Guid SubscriptionId { get; } = subscriptionId;
    public Guid ApiServiceId { get; } = apiServiceId;
    public Guid PlanId { get; } = planId;
    public DateTime? ExpiresAt { get; } = expiresAt;
}