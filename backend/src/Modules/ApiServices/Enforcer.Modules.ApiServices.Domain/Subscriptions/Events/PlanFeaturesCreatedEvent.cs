using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

public class PlanFeaturesCreatedEvent(Guid planFeaturesId, IReadOnlyList<string> features) : DomainEvent
{
    public Guid PlanFeaturesId { get; } = planFeaturesId;
    public IReadOnlyList<string> Features { get; } = features;
}
