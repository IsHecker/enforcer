using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

public sealed class SubscriptionPlanChangedEvent(Guid subscriptionId, Guid oldPlanId, Guid newPlanId) : DomainEvent
{
    public Guid SubscriptionId { get; } = subscriptionId;
    public Guid OldPlanId { get; } = oldPlanId;
    public Guid NewPlanId { get; } = newPlanId;
}