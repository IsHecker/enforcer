using Enforcer.Common.Application.Caching;
using Enforcer.Common.Application.EventBus;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Domain.ApiServices.Events;
using Enforcer.Modules.ApiServices.IntegrationEvents;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.CreateEndpoint;

public class EndpointCreatedEventHandler(ICacheService cacheService, IEventBus eventBus)
    : IDomainEventHandler<EndpointCreatedEvent>
{
    public async Task Handle(EndpointCreatedEvent domainEvent, CancellationToken cancellationToken)
    {
        await cacheService.RemoveAsync(CacheKeys.EndpointTrie(domainEvent.ApiServiceId), cancellationToken);

        await eventBus.PublishAsync(
            new EndpointCreatedIntegrationEvent(
                domainEvent.Id,
                domainEvent.OccurredOnUtc,
                domainEvent.EndpointId
            ), cancellationToken);
    }
}