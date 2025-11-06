using Enforcer.Common.Application.EventBus;

namespace Enforcer.Modules.ApiServices.IntegrationEvents.Subscriptions;

public class SubscriptionCreatedIntegrationEvent : IntegrationEvent
{
    public SubscriptionCreatedIntegrationEvent(
        Guid id,
        DateTime occurredOnUtc,
        Guid apiServiceId,
        Guid planId,
        Guid consumerId) : base(id, occurredOnUtc)
    {
        ApiServiceId = apiServiceId;
        PlanId = planId;
        ConsumerId = consumerId;
    }

    public Guid ApiServiceId { get; init; }
    public Guid PlanId { get; init; }
    public Guid ConsumerId { get; init; }
}