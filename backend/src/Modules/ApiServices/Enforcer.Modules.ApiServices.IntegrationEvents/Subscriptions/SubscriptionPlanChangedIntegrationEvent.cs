using Enforcer.Common.Application.EventBus;

namespace Enforcer.Modules.ApiServices.IntegrationEvents.Subscriptions;

public class SubscriptionPlanChangedIntegrationEvent : IntegrationEvent
{
    public SubscriptionPlanChangedIntegrationEvent(
        Guid id,
        DateTime occurredOnUtc,
        Guid oldPlanId,
        Guid currentPlanId) : base(id, occurredOnUtc)
    {
        OldPlanId = oldPlanId;
        CurrentPlanId = currentPlanId;
    }

    public Guid OldPlanId { get; init; }
    public Guid CurrentPlanId { get; init; }
}