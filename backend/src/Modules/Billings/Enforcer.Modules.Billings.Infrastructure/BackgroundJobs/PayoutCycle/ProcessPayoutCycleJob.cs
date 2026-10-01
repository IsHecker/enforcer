using Enforcer.Modules.Billings.Application.Abstractions.Services;
using Enforcer.Modules.Billings.Domain.Wallets;
using Enforcer.Modules.Billings.Infrastructure.Database;
using Enforcer.Modules.Billings.Infrastructure.Payouts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Quartz;

namespace Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.PayoutCycle;

[DisallowConcurrentExecution]
internal sealed class ProcessPayoutCycleJob(
    IOptions<PayoutCycleOptions> payoutCycleOptions,
    IOptions<PayoutOptions> payoutOptions,
    IWithdrawalService withdrawalService,
    BillingsDbContext dbContext,
    ILogger<ProcessPayoutCycleJob> logger) : IJob
{
    private readonly PayoutCycleOptions _payoutCycleOptions = payoutCycleOptions.Value;
    private readonly PayoutOptions _payoutOptions = payoutOptions.Value;

    public async Task Execute(IJobExecutionContext context)
    {
        var cancellationToken = context.CancellationToken;

        var now = DateTime.UtcNow;

        var periodStart = new DateTime(now.Year, now.Month, 1);

        var wallets = await GetEligibleForPayoutAsync(
            _payoutCycleOptions.BatchSize,
            _payoutOptions.MinimumWithdrawalAmountInCents,
            cancellationToken);

        logger.LogInformation("Found {Count} wallets eligible for payout", wallets.Count);

        var successCount = 0;
        var failureCount = 0;

        foreach (var wallet in wallets)
        {
            try
            {
                var result = await withdrawalService.ProcessPayoutAsync(
                    wallet,
                    wallet.Balance,
                    periodStart,
                    now,
                    isManual: false,
                    cancellationToken);

                if (!result.IsSuccess)
                {
                    failureCount++;
                    logger.LogWarning(
                        "Payout failed for wallet {WalletId}: {ErrorCode} - {ErrorMessage}",
                        wallet.Id,
                        result.Error.Code,
                        result.Error.Description);
                    continue;
                }

                successCount++;
            }
            catch (Exception ex)
            {
                failureCount++;
                logger.LogError(ex, "Unexpected error processing payout for wallet {WalletId}", wallet.Id);
            }
        }

        logger.LogInformation(
            "Payout cycle completed. Success: {SuccessCount}, Failed: {FailureCount}",
            successCount,
            failureCount);
    }

    public async Task<List<Wallet>> GetEligibleForPayoutAsync(
        int batchSize,
        long minimumWithdrawalAmount,
        CancellationToken cancellationToken)
    {
        return await dbContext.Wallets
            .Where(wallet =>
                wallet.StripeConnectAccountId != null &&
                wallet.Balance >= minimumWithdrawalAmount &&
                (!wallet.LastPayoutAt.HasValue || wallet.LastPayoutAt.Value.Month < DateTime.UtcNow.Month)
            )
            .Take(batchSize)
            .ToListAsync(cancellationToken);
    }
}