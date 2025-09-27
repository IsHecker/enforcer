using Enforcer.Common.Application.Exceptions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Application.Plans;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.ChangeSubscriptionPlan;

public class SubscriptionPlanChangedEventHandler(IPlanRepository planRepository, IUnitOfWork unitOfWork) : DomainEventHandler<SubscriptionPlanChangedEvent>
{
    public override async Task Handle(SubscriptionPlanChangedEvent domainEvent, CancellationToken cancellationToken = default)
    {
        var oldPlan = await planRepository.GetByIdAsync(domainEvent.OldPlanId, cancellationToken);
        if (oldPlan is null)
            throw new EnforcerException("old plan is null");

        var currentPlan = await planRepository.GetByIdAsync(domainEvent.NewPlanId, cancellationToken);
        if (currentPlan is null)
            throw new EnforcerException("current plan is null");

        var result = oldPlan.DecrementSubscriptions();
        if (result.IsFailure)
            throw new EnforcerException(nameof(Plan.DecrementSubscriptions), result.Error);

        currentPlan.IncrementSubscriptions();

        await planRepository.UpdateAsync(currentPlan, cancellationToken);
        await planRepository.UpdateAsync(currentPlan, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}