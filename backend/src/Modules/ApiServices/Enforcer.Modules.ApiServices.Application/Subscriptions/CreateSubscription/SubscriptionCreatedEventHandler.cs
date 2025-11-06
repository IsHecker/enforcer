using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.EventBus;
using Enforcer.Common.Application.Exceptions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;
using Enforcer.Modules.ApiServices.Domain.Usages;
using Enforcer.Modules.ApiServices.IntegrationEvents;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CreateSubscription;

internal sealed class SubscriptionCreatedEventHandler(
    IPlanRepository planRepository,
    IQuotaUsageRepository quotaRepository,
    IEventBus eventBus,
    IUnitOfWork unitOfWork) : IDomainEventHandler<SubscriptionCreatedEvent>
{
    public async Task Handle(SubscriptionCreatedEvent domainEvent, CancellationToken cancellationToken = default)
    {
        var plan = await planRepository.GetByIdAsync(domainEvent.PlanId, cancellationToken);
        if (plan is null)
            throw new EnforcerException("plan is null");

        await CreateQuotaUsageAsync(domainEvent.SubscriptionId, plan, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        await eventBus.PublishAsync(
            new SubscriptionCreatedIntegrationEvent(
                domainEvent.Id,
                domainEvent.OccurredOnUtc,
                domainEvent.ApiServiceId,
                plan.Id,
                domainEvent.ConsumerId
            ),
            cancellationToken
        );
    }

    private async Task CreateQuotaUsageAsync(Guid subscriptionId, Plan plan, CancellationToken ct = default)
    {
        var quotaUsage = QuotaUsage.Create(subscriptionId, plan.QuotaLimit, plan.QuotaResetPeriod);

        if (quotaUsage.IsFailure)
            throw new EnforcerException("couldn't create quota usage");

        await quotaRepository.AddAsync(quotaUsage.Value, ct);
    }
}