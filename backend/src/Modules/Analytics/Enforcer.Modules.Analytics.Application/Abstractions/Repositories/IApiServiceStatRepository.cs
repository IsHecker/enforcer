using Enforcer.Common.Application.Data;
using Enforcer.Modules.Analytics.Domain;

namespace Enforcer.Modules.Analytics.Application.Abstractions.Repositories;

public interface IApiServiceStatRepository : IRepository<ApiServiceStat>
{
    Task<ApiServiceStat?> GetByApiServiceIdAsync(Guid apiServiceId, CancellationToken cancellationToken = default);
}