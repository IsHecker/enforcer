using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Application.Abstractions.Services;
using Enforcer.Modules.Billings.Domain.Payouts;
using Enforcer.Modules.Billings.Domain.Wallets;
using Enforcer.Modules.Billings.Infrastructure.PaymentProcessing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Enforcer.Modules.Billings.Infrastructure.Payouts;

internal sealed class WithdrawalService(
    IOptions<PayoutOptions> payoutOptions,
    IWalletRepository walletRepository,
    IStripeGateway stripeGateway,
    PayoutRepository payoutRepository,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork) : IWithdrawalService
{
    private readonly PayoutOptions _payoutOptions = payoutOptions.Value;

    public async Task<Result> ProcessPayoutAsync(
        Wallet wallet,
        long amount,
        DateTime periodStart,
        DateTime periodEnd,
        bool isManual = false,
        CancellationToken cancellationToken = default)
    {
        var payoutResult = Payout.Create(
            wallet.UserId,
            amount,
            periodStart,
            periodEnd,
            wallet.Currency,
            BuildPayoutDescription(isManual, periodStart));

        if (payoutResult.IsFailure)
            return payoutResult.Error;

        var payout = payoutResult.Value;

        var withdrawResult = wallet.Withdraw(
            amount,
            _payoutOptions.MinimumWithdrawalAmountInCents);

        if (withdrawResult.IsFailure)
            return withdrawResult.Error;

        var transferResult = await stripeGateway.SendPayoutAsync(
            wallet.StripeConnectAccountId!,
            amount,
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
            wallet.ReverseWithdrawal(amount, payout.Id);
        }

        await payoutRepository.AddAsync(payout, cancellationToken);
        walletRepository.Update(wallet);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success;
    }

    private static string BuildPayoutDescription(bool isManual, DateTime periodStart)
    {
        return isManual ?
            $"Manual withdrawal At {DateTime.UtcNow:MMM yyyy}"
            : $"Monthly payout for {periodStart:MMM yyyy}";
    }
}