using Enforcer.Common.Application.Data;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Application.Abstractions.Services;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.ApiServices.Infrastructure.Subscriptions;

internal class SubscriptionService(
    IPlanRepository planRepository,
    ISubscriptionRepository subscriptionRepository,
    [FromKeyedServices(nameof(ApiServices))] IUnitOfWork unitOfWork) : ISubscriptionService
{
    public async Task<Guid> CreateSubscriptionAsync(
        Guid consumerId,
        Guid planId,
        CancellationToken cancellationToken = default)
    {
        var plan = await planRepository.GetByIdAsync(planId, cancellationToken);

        var subscription = Subscription.Create(consumerId, plan!);

        await subscriptionRepository.AddAsync(subscription.Value, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return subscription.Value.Id;
    }
}