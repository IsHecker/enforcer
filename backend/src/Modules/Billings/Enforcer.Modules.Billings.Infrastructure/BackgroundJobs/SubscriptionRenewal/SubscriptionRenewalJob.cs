using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.ApiServices.PublicApi;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Quartz;

namespace Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.SubscriptionRenewal;

[DisallowConcurrentExecution]
internal sealed class SubscriptionRenewalJob(
    IOptions<SubscriptionRenewalOptions> options,
    IApiServicesApi servicesApi,
    SubscriptionRenewalService renewalService,
    ILogger<SubscriptionRenewalJob> logger) : IJob
{
    private readonly SubscriptionRenewalOptions _options = options.Value;

    public async Task Execute(IJobExecutionContext context)
    {
        var ct = context.CancellationToken;

        logger.LogInformation("Starting subscription renewal job");

        var candidates = await servicesApi.GetExpiredSubscriptions(_options.BatchSize, ct);

        logger.LogInformation("Found {Count} subscriptions to renew", candidates.Count);

        await ProcessRenewalsAsync(candidates, ct);
    }

    private async Task ProcessRenewalsAsync(
        IReadOnlyList<SubscriptionResponse> subscriptions,
        CancellationToken cancellationToken)
    {
        var successCount = 0;
        var failureCount = 0;

        foreach (var subscription in subscriptions)
        {
            try
            {
                var result = await renewalService.RenewAsync(subscription, cancellationToken);

                if (!result.IsSuccess)
                {
                    failureCount++;
                    continue;
                }

                successCount++;
                logger.LogDebug("Renewed subscription {SubscriptionId}", subscription.Id);
            }
            catch (Exception ex)
            {
                failureCount++;
                logger.LogError(ex, "Unexpected error renewing subscription {SubscriptionId}", subscription.Id);
            }
        }

        logger.LogInformation(
            "Subscription renewal completed. Success: {SuccessCount}, Failed: {FailureCount}",
            successCount,
            failureCount);
    }
}