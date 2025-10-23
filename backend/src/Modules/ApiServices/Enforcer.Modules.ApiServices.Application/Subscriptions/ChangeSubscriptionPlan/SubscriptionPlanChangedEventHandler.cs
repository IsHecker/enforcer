using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Exceptions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Application.Plans;
using Enforcer.Modules.ApiServices.Application.QuotaUsages;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.ChangeSubscriptionPlan;

internal sealed class SubscriptionPlanChangedEventHandler(
    IPlanRepository planRepository,
    IQuotaUsageRepository quotaRepository,
    IUnitOfWork unitOfWork) : IDomainEventHandler<SubscriptionPlanChangedEvent>
{
    public async Task Handle(SubscriptionPlanChangedEvent domainEvent, CancellationToken cancellationToken = default)
    {
        var oldPlan = await planRepository.GetByIdAsync(domainEvent.OldPlanId, cancellationToken);
        if (oldPlan is null)
            throw new EnforcerException("old plan is null");

        var currentPlan = await planRepository.GetByIdAsync(domainEvent.NewPlanId, cancellationToken);
        if (currentPlan is null)
            throw new EnforcerException("current plan is null");

        oldPlan.DecrementSubscriptions();
        currentPlan.IncrementSubscriptions();

        await ResetQuotaUsageAsync(domainEvent.SubscriptionId, currentPlan, cancellationToken);

        planRepository.Update(oldPlan);
        planRepository.Update(currentPlan);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task ResetQuotaUsageAsync(Guid subscriptionId, Plan plan, CancellationToken ct)
    {
        var quotaUsage = await quotaRepository.GetBySubscriptionIdAsync(subscriptionId, ct);
        quotaUsage!.ResetQuota(plan.QuotaLimit, plan.QuotaResetPeriod, hardReset: true);
        quotaRepository.Update(quotaUsage);
    }
}