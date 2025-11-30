using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Analytics.Domain;
using Enforcer.Modules.Analytics.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Analytics.Infrastructure.EndpointStats;

public class EndpointStatRepository(AnalyticsDbContext context)
    : Repository<EndpointStat>(context), IEndpointStatRepository
{
    public Task<EndpointStat?> GetByEndpointIdAsync(Guid endpointId, CancellationToken cancellationToken = default)
    {
        return context.EndpointStats
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.EndpointId == endpointId, cancellationToken);
    }
}