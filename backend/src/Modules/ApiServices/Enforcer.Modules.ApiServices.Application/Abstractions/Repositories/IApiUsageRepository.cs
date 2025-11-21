using Enforcer.Common.Application.Data;
using Enforcer.Modules.ApiServices.Domain.ApiUsages;

namespace Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;

public interface IApiUsageRepository : IRepository<ApiUsage>
{
    Task<ApiUsage?> GetBySubscriptionIdAsync(
        Guid subscriptionId,
        CancellationToken cancellationToken = default);
}