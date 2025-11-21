using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.EventBus;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.ApiServices.Events;
using Enforcer.Modules.ApiServices.Domain.Plans;
using Enforcer.Modules.ApiServices.IntegrationEvents.ApiServices;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.CreateApiService;

public class ApiServiceCreatedEventHandler(
    IPlanRepository planRepository,
    IEventBus eventBus,
    [FromKeyedServices(nameof(ApiServices))] IUnitOfWork unitOfWork)
    : IDomainEventHandler<ApiServiceCreatedEvent>
{
    public async Task Handle(ApiServiceCreatedEvent domainEvent, CancellationToken cancellationToken)
    {
        var plan = Plan.CreateDefaultFreePlan(domainEvent.ApiServiceId, domainEvent.CreatorId);
        await planRepository.AddAsync(plan, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        await eventBus.PublishAsync(
            new ApiServiceCreatedIntegrationEvent(
                domainEvent.Id,
                domainEvent.OccurredOnUtc,
                domainEvent.ApiServiceId,
                domainEvent.CreatorId),
            cancellationToken);
    }
}