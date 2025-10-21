using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

internal sealed class PlanSubscriptionRemovedEvent(Guid planId, int subscriptionsCount) : DomainEvent
{
    public Guid PlanId { get; } = planId;
    public int SubscriptionsCount { get; } = subscriptionsCount;
}
