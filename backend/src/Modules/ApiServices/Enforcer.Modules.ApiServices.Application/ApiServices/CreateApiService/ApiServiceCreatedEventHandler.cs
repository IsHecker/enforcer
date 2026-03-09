using Enforcer.Common.Application.EventBus;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Domain.ApiServices.Events;
using Enforcer.Modules.ApiServices.IntegrationEvents.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.CreateApiService;

public class ApiServiceCreatedEventHandler(IEventBus eventBus)
    : IDomainEventHandler<ApiServiceCreatedEvent>
{
    public async Task Handle(ApiServiceCreatedEvent domainEvent, CancellationToken cancellationToken)
    {
        await eventBus.PublishAsync(
            new ApiServiceCreatedIntegrationEvent(
                domainEvent.Id,
                domainEvent.OccurredOnUtc,
                domainEvent.ApiServiceId,
                domainEvent.CreatorId),
            cancellationToken);
    }
}