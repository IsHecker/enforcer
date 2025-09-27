using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

public class PlanActivatedEvent(Guid planId) : DomainEvent
{
    public Guid PlanId { get; } = planId;
}
