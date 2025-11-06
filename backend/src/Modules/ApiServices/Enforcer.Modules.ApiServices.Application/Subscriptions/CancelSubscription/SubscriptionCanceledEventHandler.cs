using Enforcer.Common.Application.EventBus;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;
using Enforcer.Modules.ApiServices.IntegrationEvents;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CancelSubscription;

internal sealed class SubscriptionCanceledEventHandler(
    IEventBus eventBus) : IDomainEventHandler<SubscriptionCanceledEvent>
{
    public async Task Handle(SubscriptionCanceledEvent domainEvent, CancellationToken cancellationToken = default)
    {
        await eventBus.PublishAsync(
            new SubscriptionCanceledIntegrationEvent(
                domainEvent.Id,
                domainEvent.OccurredOnUtc,
                domainEvent.ApiServiceId,
                domainEvent.PlanId
            ),
            cancellationToken
        );
    }
}