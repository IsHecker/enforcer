using Enforcer.Common.Application.Caching;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Domain.ApiServices.Events;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.CreateEndpoint;

public class EndpointCreatedEventHandler(ICacheService cacheService) : IDomainEventHandler<EndpointCreatedEvent>
{
    public async Task Handle(EndpointCreatedEvent domainEvent, CancellationToken cancellationToken)
    {
        await cacheService.RemoveAsync(CacheKeys.EndpointTrie(domainEvent.ApiServiceId), cancellationToken);
    }
}