using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Services;
using Enforcer.Modules.Billings.Domain.Payouts;
using Enforcer.Modules.Billings.Domain.Wallets;
using Enforcer.Modules.Billings.Infrastructure.PaymentProcessing;
using Enforcer.Modules.Billings.Infrastructure.WalletEntries;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Enforcer.Modules.Billings.Infrastructure.Payouts;

internal sealed class WithdrawalService(
    IOptions<PayoutOptions> payoutOptions,
    IStripeGateway stripeGateway,
    PayoutRepository payoutRepository,
    WalletEntryRepository walletEntryRepository) : IWithdrawalService
{
    private readonly PayoutOptions _payoutOptions = payoutOptions.Value;

    public async Task<Result> ProcessPayoutAsync(
        Wallet wallet,
        DateTime periodStart,
        DateTime periodEnd,
        CancellationToken cancellationToken = default)
    {
        var payoutAmount = wallet.Balance;

        var payoutResult = Payout.Create(
            wallet.UserId,
            payoutAmount,
            periodStart,
            periodEnd,
            wallet.Currency,
            $"Monthly payout for {periodStart:MMM yyyy}");

        if (payoutResult.IsFailure)
            return payoutResult.Error;

        var payout = payoutResult.Value;

        var withdrawResult = wallet.Withdraw(
            payoutAmount,
            _payoutOptions.MinimumWithdrawalAmountInCents,
            payout.Id);

        if (withdrawResult.IsFailure)
            return withdrawResult.Error;

        var transferResult = await stripeGateway.SendPayoutAsync(
            wallet.StripeConnectAccountId!,
            payoutAmount,
            new Dictionary<string, string>
            {
                [MetadataKeys.PayoutId.Key] = payout.Id.ToString(),
                [MetadataKeys.UserId.Key] = wallet.UserId.ToString()
            },
            cancellationToken
        );

        if (transferResult.IsFailure)
        {
            payout.MarkAsFailed(transferResult.Error.Description);
            wallet.ReverseWithdrawal(payoutAmount, payout.Id);
        }

        await payoutRepository.AddAsync(payout, cancellationToken);
        await walletEntryRepository.AddRangeAsync(wallet.Entries, cancellationToken);

        return Result.Success;
    }
}