using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Analytics.Domain;
using Enforcer.Modules.Analytics.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Analytics.Infrastructure.PlanStats;

public class PlanStatRepository(AnalyticsDbContext context)
    : Repository<PlanStat>(context), IPlanStatRepository
{
    public async Task<PlanStat?> GetByPlanIdAsync(Guid planId, CancellationToken cancellationToken = default)
    {
        return await context.PlanStats
            .AsNoTracking()
            .FirstOrDefaultAsync(ps => ps.PlanId == planId, cancellationToken);
    }
}