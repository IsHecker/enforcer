using Enforcer.Modules.ApiServices.PublicApi;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Quartz;

namespace Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.ExpiredSubscriptionCleanup;

[DisallowConcurrentExecution]
internal sealed class ExpiredSubscriptionCleanupJob(
    IOptions<ExpiredSubscriptionCleanupOptions> options,
    IApiServicesApi servicesApi,
    ILogger<ExpiredSubscriptionCleanupJob> logger) : IJob
{
    private readonly ExpiredSubscriptionCleanupOptions _options = options.Value;

    public async Task Execute(IJobExecutionContext context)
    {
        logger.LogInformation("Starting expired subscription cleanup job");

        var deletedSubs = await servicesApi.DeleteExpiredSubscriptions(_options.BatchSize, context.CancellationToken);

        logger.LogInformation(
            "Expired subscription cleanup completed. Deleted {DeletedCount} subscriptions",
            deletedSubs);
    }
}