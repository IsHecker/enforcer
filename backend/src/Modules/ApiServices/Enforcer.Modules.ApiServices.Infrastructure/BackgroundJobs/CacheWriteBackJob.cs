using Enforcer.Common.Application.Caching;
using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Microsoft.Extensions.Logging;
using Quartz;

namespace Enforcer.Modules.ApiServices.Infrastructure.BackgroundJobs;

[DisallowConcurrentExecution]
internal sealed class CacheWriteBackJob(
    ApiServicesDbContext dbContext,
    ICacheService cacheService,
    ILogger<CacheWriteBackJob> logger) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        var startTime = DateTime.UtcNow;
        logger.LogInformation("Cache write-back job started (StartedAt={StartTime})", startTime);

        try
        {
            var items = await cacheService.GetPendingWriteBacksByPrefixAsync("quota:");

            if (items.Count < 1)
            {
                logger.LogInformation("No pending write-back items found");
                return;
            }

            logger.LogInformation("Processing {Count} pending items", items.Count);
            logger.LogInformation("Found {ItemCount} pending write-back. Beginning persistence to database...", items.Count);

            foreach (Entity entity in items.Cast<Entity>())
            {
                dbContext.Update(entity);
            }

            await dbContext.SaveChangesAsync();

            var duration = DateTime.UtcNow - startTime;
            logger.LogInformation(
                "Cache write-back completed successfully. Persisted {UpdatedCount}, Duration={DurationMs}ms).",
                items.Count, duration.TotalMilliseconds);
        }
        catch (Exception ex)
        {
            var duration = DateTime.UtcNow - startTime;
            logger.LogError(ex,
                "Cache write-back job failed after {DurationMs}ms. Exception: {Message}",
                duration.TotalMilliseconds, ex.Message);
        }
    }
}