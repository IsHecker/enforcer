using Enforcer.Common.Application.Data;
using Enforcer.Modules.Analytics.Domain;

namespace Enforcer.Modules.Analytics.Application.Abstractions.Repositories;

public interface IEndpointStatRepository : IRepository<EndpointStat>
{
    Task<EndpointStat?> GetByEndpointIdAsync(Guid endpointId, CancellationToken ct = default);
}