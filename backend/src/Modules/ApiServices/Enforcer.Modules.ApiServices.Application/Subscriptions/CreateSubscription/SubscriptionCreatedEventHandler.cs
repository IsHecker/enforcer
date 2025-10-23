using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Exceptions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Application.Plans;
using Enforcer.Modules.ApiServices.Application.QuotaUsages;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;
using Enforcer.Modules.ApiServices.Domain.Usages;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CreateSubscription;

internal sealed class SubscriptionCreatedEventHandler(
    IPlanRepository planRepository,
    IApiServiceRepository apiServiceRepository,
    IQuotaUsageRepository quotaRepository,
    IUnitOfWork unitOfWork) : IDomainEventHandler<SubscriptionCreatedEvent>
{
    public async Task Handle(SubscriptionCreatedEvent domainEvent, CancellationToken cancellationToken = default)
    {
        var apiService = await apiServiceRepository.GetByIdAsync(domainEvent.ApiServiceId, cancellationToken);
        if (apiService is null)
            throw new EnforcerException("api service is null");

        var plan = await planRepository.GetByIdAsync(domainEvent.PlanId, cancellationToken);
        if (plan is null)
            throw new EnforcerException("plan is null");

        plan.IncrementSubscriptions();
        apiService.IncrementSubscriptions();

        await CreateQuotaUsageAsync(domainEvent.SubscriptionId, plan, cancellationToken);

        planRepository.Update(plan);
        apiServiceRepository.Update(apiService);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task CreateQuotaUsageAsync(Guid subscriptionId, Plan plan, CancellationToken ct = default)
    {
        var quotaUsage = QuotaUsage.Create(subscriptionId, plan.QuotaLimit, plan.QuotaResetPeriod);

        if (quotaUsage.IsFailure)
            throw new EnforcerException("couldn't create quota usage");

        await quotaRepository.AddAsync(quotaUsage.Value, ct);
    }
}