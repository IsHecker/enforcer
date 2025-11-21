using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.ApiUsages;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.ApiUsages;

internal sealed class ApiUsageRepository(ApiServicesDbContext context) : Repository<ApiUsage>(context), IApiUsageRepository
{
    public async Task<ApiUsage?> GetBySubscriptionIdAsync(
        Guid subscriptionId,
        CancellationToken cancellationToken = default)
    {
        return await context.ApiUsages
            .AsNoTracking()
            .FirstOrDefaultAsync(
                q => q.SubscriptionId == subscriptionId,
                cancellationToken);
    }
}