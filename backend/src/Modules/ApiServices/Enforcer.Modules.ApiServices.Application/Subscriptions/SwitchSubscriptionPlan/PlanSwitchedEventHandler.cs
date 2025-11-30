using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.EventBus;
using Enforcer.Common.Application.Exceptions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.Plans;
using Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;
using Enforcer.Modules.ApiServices.IntegrationEvents.Subscriptions;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.SwitchSubscriptionPlan;

internal sealed class PlanSwitchedEventHandler(
    IPlanRepository planRepository,
    IApiUsageRepository apiUsageRepository,
    IEventBus eventBus,
    [FromKeyedServices(nameof(ApiServices))] IUnitOfWork unitOfWork) : IDomainEventHandler<PlanSwitchedEvent>
{
    public async Task Handle(PlanSwitchedEvent domainEvent, CancellationToken cancellationToken = default)
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

    private async Task ResetQuotaUsageAsync(Guid subscriptionId, Plan plan, CancellationToken cancellationToken)
    {
        // TODO: handle overages

        var apiUsage = await apiUsageRepository.GetBySubscriptionIdAsync(subscriptionId, cancellationToken);
        apiUsage!.ResetUsage(plan.QuotaLimit, plan.QuotaResetPeriod, forceReset: true);
        apiUsageRepository.Update(apiUsage);
    }
}