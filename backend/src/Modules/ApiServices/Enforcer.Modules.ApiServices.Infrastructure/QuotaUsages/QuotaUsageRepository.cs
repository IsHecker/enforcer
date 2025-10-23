using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.ApiServices.Application.QuotaUsages;
using Enforcer.Modules.ApiServices.Domain.Usages;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.QuotaUsages;

internal sealed class QuotaUsageRepository(ApiServicesDbContext context) : Repository<QuotaUsage>(context), IQuotaUsageRepository
{
    public async Task<QuotaUsage?> GetBySubscriptionIdAsync(
        Guid subscriptionId,
        CancellationToken cancellationToken = default)
    {
        return await context.QuotaUsages
            .AsNoTracking()
            .FirstOrDefaultAsync(
                q => q.SubscriptionId == subscriptionId,
                cancellationToken);
    }
}