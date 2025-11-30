using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Analytics.Domain;
using Enforcer.Modules.Analytics.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Analytics.Infrastructure.ApiServiceStats;

public class ApiServiceStatRepository(AnalyticsDbContext context)
    : Repository<ApiServiceStat>(context), IApiServiceStatRepository
{
    public Task<ApiServiceStat?> GetByApiServiceIdAsync(Guid apiServiceId, CancellationToken cancellationToken = default)
    {
        return context.ApiServiceStats
            .AsNoTracking()
            .FirstOrDefaultAsync(api => api.ApiServiceId == apiServiceId, cancellationToken);
    }
}