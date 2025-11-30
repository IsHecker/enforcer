using Enforcer.Common.Application.Data;
using Enforcer.Modules.Analytics.Domain;

namespace Enforcer.Modules.Analytics.Application.Abstractions.Repositories;

public interface ISubscriptionStatRepository : IRepository<SubscriptionStat>
{
    Task<SubscriptionStat?> GetBySubscriptionIdAsync(Guid subscriptionId, CancellationToken cancellationToken = default);
}