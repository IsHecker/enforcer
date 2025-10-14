using Enforcer.Common.Application.Caching;
using Enforcer.Modules.ApiServices.Application.QuotaUsages;
using Enforcer.Modules.ApiServices.Contracts.Usages;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Quartz;

namespace Enforcer.Modules.ApiServices.Infrastructure.BackgroundJobs;

[DisallowConcurrentExecution]
internal sealed class CacheWriteBackJob(ApiServicesDbContext dbContext, ICacheService cacheService) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        try
        {
            var items = await cacheService.GetPendingWriteBacksByPrefixAsync("quota:");
            if (items.Count < 1)
                return;

            foreach (var item in items)
            {
                if (item is QuotaUsageResponse response)
                    dbContext.Update(response.ToDomain());
            }

            await dbContext.SaveChangesAsync();
        }
        catch (Exception exception)
        {
        }
    }
}