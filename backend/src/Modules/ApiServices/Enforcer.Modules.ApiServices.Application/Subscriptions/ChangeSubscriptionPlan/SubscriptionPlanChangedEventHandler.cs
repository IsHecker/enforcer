using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.EventBus;
using Enforcer.Common.Application.Exceptions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;
using Enforcer.Modules.ApiServices.IntegrationEvents;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.ChangeSubscriptionPlan;

internal sealed class SubscriptionPlanChangedEventHandler(
    IPlanRepository planRepository,
    IQuotaUsageRepository quotaRepository,
    IEventBus eventBus,
    IUnitOfWork unitOfWork) : IDomainEventHandler<SubscriptionPlanChangedEvent>
{
    public async Task Handle(SubscriptionPlanChangedEvent domainEvent, CancellationToken cancellationToken = default)
    {
        var currentPlan = await planRepository.GetByIdAsync(domainEvent.NewPlanId, cancellationToken);
        if (currentPlan is null)
            throw new EnforcerException("current plan is null");

        await ResetQuotaUsageAsync(domainEvent.SubscriptionId, currentPlan, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        await eventBus.PublishAsync(
            new SubscriptionPlanChangedIntegrationEvent(
                domainEvent.Id,
                domainEvent.OccurredOnUtc,
                domainEvent.OldPlanId,
                domainEvent.NewPlanId
            ),
            cancellationToken
        );
    }

    private async Task ResetQuotaUsageAsync(Guid subscriptionId, Plan plan, CancellationToken ct)
    {
        var quotaUsage = await quotaRepository.GetBySubscriptionIdAsync(subscriptionId, ct);
        quotaUsage!.ResetQuota(plan.QuotaLimit, plan.QuotaResetPeriod, forceReset: true);
        quotaRepository.Update(quotaUsage);
    }
}