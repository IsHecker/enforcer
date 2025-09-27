using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

public class SubscriptionCreatedEvent(
    Guid subscriptionId,
    Guid planId,
    Guid apiServiceId) : DomainEvent
{
    public Guid SubscriptionId { get; } = subscriptionId;
    public Guid PlanId { get; } = planId;
    public Guid ApiServiceId { get; } = apiServiceId;
}