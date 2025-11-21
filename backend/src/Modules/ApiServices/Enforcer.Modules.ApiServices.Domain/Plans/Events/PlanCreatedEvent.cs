using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Plans.Events;

public sealed class PlanCreatedEvent(Guid planId, Guid apiServiceId, Guid creatorId, PlanType type) : DomainEvent
{
    public Guid PlanId { get; } = planId;
    public Guid ApiServiceId { get; } = apiServiceId;
    public Guid CreatorId { get; } = creatorId;
    public PlanType Type { get; } = type;
}