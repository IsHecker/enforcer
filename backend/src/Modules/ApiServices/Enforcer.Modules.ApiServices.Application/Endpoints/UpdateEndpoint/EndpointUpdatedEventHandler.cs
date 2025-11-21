using Enforcer.Common.Application.Caching;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Domain.Endpoints.Events;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.UpdateEndpoint;

public class EndpointUpdatedEventHandler(ICacheService cacheService) : IDomainEventHandler<EndpointUpdatedEvent>
{
    public async Task Handle(EndpointUpdatedEvent domainEvent, CancellationToken cancellationToken)
    {
        await cacheService.RemoveAsync(CacheKeys.EndpointTrie(domainEvent.ApiServiceId), cancellationToken);
    }
}