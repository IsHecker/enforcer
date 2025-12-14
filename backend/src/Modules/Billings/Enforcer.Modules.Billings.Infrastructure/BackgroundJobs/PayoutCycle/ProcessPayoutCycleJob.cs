using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Services;
using Enforcer.Modules.Billings.Domain.Payouts;
using Enforcer.Modules.Billings.Domain.Wallets;
using Enforcer.Modules.Billings.Infrastructure.Database;
using Enforcer.Modules.Billings.Infrastructure.PaymentProcessing;
using Enforcer.Modules.Billings.Infrastructure.Payouts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Quartz;

namespace Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.PayoutCycle;

[DisallowConcurrentExecution]
internal sealed class ProcessPayoutCycleJob(
    IOptions<PayoutCycleOptions> payoutCycleOptions,
    IOptions<PayoutOptions> payoutOptions,
    IWithdrawalService withdrawalService,
    BillingsDbContext dbContext) : IJob
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
            context.CancellationToken);

        foreach (var wallet in wallets)
        {
            await withdrawalService.ProcessPayoutAsync(wallet, periodStart, now, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<List<Wallet>> GetEligibleForPayoutAsync(
        int batchSize,
        long minimumWithdrawalAmount,
        CancellationToken cancellationToken)
    {
        return await dbContext.Wallets
            .Where(w =>
                w.StripeConnectAccountId != null &&
                w.Balance >= minimumWithdrawalAmount &&
                (!w.LastPayoutAt.HasValue || w.LastPayoutAt.Value.Month < DateTime.UtcNow.Month))
            .Take(batchSize)
            .ToListAsync(cancellationToken);
    }
}