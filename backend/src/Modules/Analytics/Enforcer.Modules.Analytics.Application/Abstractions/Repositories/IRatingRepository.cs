using Enforcer.Common.Application.Data;
using Enforcer.Modules.Analytics.Domain;

namespace Enforcer.Modules.Analytics.Application.Abstractions.Repositories;

public interface IRatingRepository : IRepository<Rating>
{
    Task<Rating?> GetAsync(Guid consumerId, Guid apiServiceId, CancellationToken cancellationToken);
}