using Enforcer.Common.Application.Data;
using Enforcer.Modules.Analytics.Domain;

namespace Enforcer.Modules.Analytics.Application.Abstractions.Repositories;

public interface IPlanStatRepository : IRepository<PlanStat>
{
    Task<PlanStat?> GetByPlanIdAsync(Guid planId, CancellationToken cancellationToken = default);
}