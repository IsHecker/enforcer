using Enforcer.Modules.ApiServices.Application.QuotaUsages;
using Enforcer.Modules.ApiServices.Domain.Usages;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.QuotaUsages;

internal sealed class QuotaUsageRepository(ApiServicesDbContext context) : IQuotaUsageRepository
{
    public async Task AddAsync(QuotaUsage quotaUsage, CancellationToken cancellationToken = default)
    {
        await context.QuotaUsages.AddAsync(quotaUsage, cancellationToken);
    }

    public async Task<QuotaUsage?> GetBySubscriptionAndServiceAsync(
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