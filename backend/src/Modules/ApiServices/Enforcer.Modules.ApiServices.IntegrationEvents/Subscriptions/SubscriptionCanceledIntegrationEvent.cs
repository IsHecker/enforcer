using Enforcer.Common.Application.EventBus;

namespace Enforcer.Modules.ApiServices.IntegrationEvents.Subscriptions;

public class SubscriptionCanceledIntegrationEvent : IntegrationEvent
{
    public SubscriptionCanceledIntegrationEvent(
        Guid id,
        DateTime occurredOnUtc,
        Guid apiServiceId,
        Guid planId) : base(id, occurredOnUtc)
    {
        ApiServiceId = apiServiceId;
        PlanId = planId;
    }

    public Guid ApiServiceId { get; init; }
    public Guid PlanId { get; init; }
}