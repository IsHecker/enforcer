using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions;

public interface ISubscriptionRepository
{
    Task<Subscription?> GetByIdAsync(Guid subscriptionId, CancellationToken cancellationToken = default);
    Task AddAsync(Subscription subscription, CancellationToken cancellationToken = default);
    Task UpdateAsync(Subscription subscription, CancellationToken cancellationToken = default);
    Task DeleteAsync(Subscription subscription, CancellationToken cancellationToken = default);
    Task<List<Subscription>> ListByConsumerAsync(Guid consumerId, CancellationToken cancellationToken = default);
    Task<List<Subscription>> ListByApiServiceAsync(Guid apiServiceId, CancellationToken cancellationToken = default);
    Task<bool> ExistsActiveSubscriptionAsync(Guid consumerId, Guid apiServiceId, CancellationToken cancellationToken = default);
}