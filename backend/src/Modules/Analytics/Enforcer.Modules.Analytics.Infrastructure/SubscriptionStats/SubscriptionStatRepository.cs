using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Analytics.Domain;
using Enforcer.Modules.Analytics.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Analytics.Infrastructure.SubscriptionStats;

public class SubscriptionStatRepository(AnalyticsDbContext context)
    : Repository<SubscriptionStat>(context), ISubscriptionStatRepository
{
    public async Task<SubscriptionStat?> GetBySubscriptionIdAsync(Guid subscriptionId, CancellationToken ct = default)
    {
        return await context.SubscriptionStats
            .AsNoTracking()
            .FirstOrDefaultAsync(sub => sub.SubscriptionId == subscriptionId, ct);
    }
}