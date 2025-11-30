using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Analytics.Domain;
using Enforcer.Modules.Analytics.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Analytics.Infrastructure.Ratings;

public class RatingRepository(AnalyticsDbContext context)
    : Repository<Rating>(context), IRatingRepository
{
    public Task<Rating?> GetAsync(Guid consumerId, Guid apiServiceId, CancellationToken cancellationToken)
    {
        return context.Ratings
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.ConsumerId == consumerId && r.ApiServiceId == apiServiceId, cancellationToken);
    }
}