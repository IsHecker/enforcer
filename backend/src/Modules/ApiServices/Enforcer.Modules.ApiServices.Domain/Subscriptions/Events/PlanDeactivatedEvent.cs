using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

internal sealed class PlanDeactivatedEvent(Guid planId) : DomainEvent
{
    public Guid PlanId { get; } = planId;
}
