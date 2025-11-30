using Enforcer.Common.Application.Data;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;

public interface ISubscriptionRepository : IRepository<Subscription>
{
    Task<List<Subscription>> ListByConsumerAsync(Guid consumerId, CancellationToken cancellationToken = default);
    Task<List<Subscription>> ListByApiServiceAsync(Guid apiServiceId, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid consumerId, Guid apiServiceId, CancellationToken cancellationToken = default);
    Task<bool> ExistsByApiKeyAsync(string apiKey, CancellationToken cancellationToken = default);
}