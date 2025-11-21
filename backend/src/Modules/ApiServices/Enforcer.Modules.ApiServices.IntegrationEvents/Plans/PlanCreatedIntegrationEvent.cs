using Enforcer.Common.Application.EventBus;

namespace Enforcer.Modules.ApiServices.IntegrationEvents.Plans;

public class PlanCreatedIntegrationEvent : IntegrationEvent
{
    public PlanCreatedIntegrationEvent(
        Guid id,
        DateTime occurredOnUtc,
        Guid planId) : base(id, occurredOnUtc)
    {
        PlanId = planId;
    }

    public Guid PlanId { get; init; }
}