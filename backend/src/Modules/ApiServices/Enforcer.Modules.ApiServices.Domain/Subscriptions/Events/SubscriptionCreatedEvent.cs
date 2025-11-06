using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

public sealed class SubscriptionCreatedEvent(
    Guid subscriptionId,
    Guid consumerId,
    Guid planId,
    Guid apiServiceId) : DomainEvent
{
    public Guid SubscriptionId { get; } = subscriptionId;
    public Guid ConsumerId { get; } = consumerId;
    public Guid PlanId { get; } = planId;
    public Guid ApiServiceId { get; } = apiServiceId;
}