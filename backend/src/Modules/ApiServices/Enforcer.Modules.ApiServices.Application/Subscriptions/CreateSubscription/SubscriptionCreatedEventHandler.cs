using Enforcer.Common.Application.Abstractions.Data;
using Enforcer.Common.Application.Exceptions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Application.Plans;
using Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CreateSubscription;

public class SubscriptionCreatedEventHandler(
    IPlanRepository planRepository,
    IApiServiceRepository apiServiceRepository,
    IUnitOfWork unitOfWork) : DomainEventHandler<SubscriptionCreatedEvent>
{
    public override async Task Handle(SubscriptionCreatedEvent domainEvent, CancellationToken cancellationToken = default)
    {
        var apiService = await apiServiceRepository.GetByIdAsync(domainEvent.ApiServiceId, cancellationToken);
        if (apiService is null)
            throw new EnforcerException("api service is null");

        var plan = await planRepository.GetByIdAsync(domainEvent.PlanId, cancellationToken);
        if (plan is null)
            throw new EnforcerException("plan is null");

        plan.IncrementSubscriptions();
        apiService.IncrementSubscriptions();

        await planRepository.UpdateAsync(plan, cancellationToken);
        await apiServiceRepository.UpdateAsync(apiService, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}