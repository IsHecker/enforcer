using Enforcer.Common.Application.EventBus;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Domain.Plans.Events;
using Enforcer.Modules.ApiServices.IntegrationEvents;
using Enforcer.Modules.ApiServices.IntegrationEvents.Plans;

namespace Enforcer.Modules.ApiServices.Application.Plans.CreatePlan;

public class PlanCreatedEventHandler(IEventBus eventBus) : IDomainEventHandler<PlanCreatedEvent>
{
    public async Task Handle(PlanCreatedEvent domainEvent, CancellationToken cancellationToken)
    {
        await eventBus.PublishAsync(
            new PlanCreatedIntegrationEvent(
                domainEvent.Id,
                domainEvent.OccurredOnUtc,
                domainEvent.PlanId
            ), cancellationToken);
    }
}