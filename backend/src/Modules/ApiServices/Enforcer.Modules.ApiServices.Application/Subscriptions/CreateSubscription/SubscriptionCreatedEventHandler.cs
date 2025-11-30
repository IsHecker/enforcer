using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.EventBus;
using Enforcer.Common.Application.Exceptions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.ApiUsages;
using Enforcer.Modules.ApiServices.Domain.Plans;
using Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;
using Enforcer.Modules.ApiServices.IntegrationEvents.Subscriptions;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CreateSubscription;

internal sealed class SubscriptionCreatedEventHandler(
    IPlanRepository planRepository,
    IApiUsageRepository apiUsageRepository,
    IEventBus eventBus,
    [FromKeyedServices(nameof(ApiServices))] IUnitOfWork unitOfWork)
    : IDomainEventHandler<SubscriptionCreatedEvent>
{
    public async Task Handle(SubscriptionCreatedEvent domainEvent, CancellationToken cancellationToken = default)
    {
        var plan = await planRepository.GetByIdAsync(domainEvent.PlanId, cancellationToken);
        if (plan is null)
            throw new EnforcerException("plan is null");

        await CreateApiUsageAsync(domainEvent.SubscriptionId, plan, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        await eventBus.PublishAsync(
            new SubscriptionCreatedIntegrationEvent(
                domainEvent.Id,
                domainEvent.OccurredOnUtc,
                domainEvent.ApiServiceId,
                domainEvent.SubscriptionId,
                plan.Id,
                domainEvent.ConsumerId
            ),
            cancellationToken
        );
    }

    private async Task CreateApiUsageAsync(Guid subscriptionId, Plan plan, CancellationToken cancellationToken = default)
    {
        var apiUsage = ApiUsage.Create(subscriptionId, plan.QuotaLimit, plan.QuotaResetPeriod);

        if (apiUsage.IsFailure)
            throw new EnforcerException("couldn't create quota usage");

        await apiUsageRepository.AddAsync(apiUsage.Value, cancellationToken);
    }
}