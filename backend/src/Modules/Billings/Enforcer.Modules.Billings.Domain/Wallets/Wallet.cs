using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Domain.WalletEntries;

namespace Enforcer.Modules.Billings.Domain.Wallets;

public sealed class Wallet : Entity
{
    public Guid UserId { get; private set; }

    public long Balance { get; private set; }
    public long Credits { get; private set; }
    public long LifetimeEarnings { get; private set; }
    public string Currency { get; private set; }

    public DateTime? LastPayoutAt { get; private set; }

    public string StripeConnectAccountId { get; private set; }
    public bool IsOnboardingComplete { get; private set; }

    public bool IsPayoutMethodConfigured =>
        StripeConnectAccountId is not null && IsOnboardingComplete;

    private readonly List<WalletEntry> _entries = [];
    public IReadOnlyList<WalletEntry> Entries => _entries;

    private Wallet() { }

    public static Wallet Create(
        Guid userId,
        string stripeConnectAccountId,
        string currency = "USD")
    {
        return new Wallet
        {
            UserId = userId,
            Balance = 0,
            LifetimeEarnings = 0,
            Currency = currency,
            StripeConnectAccountId = stripeConnectAccountId,
            IsOnboardingComplete = false
        };
    }

    public Result AddEarnings(Guid paymentId, long totalAmount, int platformFeePercentage)
    {
        if (totalAmount <= 0)
            return WalletErrors.InvalidEarningAmount;

        var providerShare = CalculateProviderShare(totalAmount, platformFeePercentage);

        Balance += providerShare;
        LifetimeEarnings += providerShare;

        _entries.Add(WalletEntry.Create(
            Id,
            WalletEntryType.Earning,
            providerShare,
            Currency,
            paymentId,
            "Earnings from invoice"));

        return Result.Success;
    }

    public Result AddCredit(long amount, Guid invoiceId)
    {
        if (amount <= 0)
            return WalletErrors.InvalidCreditAmount;

        Credits += amount;

        _entries.Add(WalletEntry.Create(
            Id,
            WalletEntryType.Credit,
            amount,
            Currency,
            invoiceId,
            "Credit added from invoice"));

        return Result.Success;
    }

    public Result Charge(long amount, Guid invoiceId)
    {
        if (amount <= 0)
            return WalletErrors.InvalidChargeAmount;

        // TODO: charge from credits or transfer credits to balance and charge balance.

        if (Balance < amount)
            return WalletErrors.InsufficientBalance(Balance, amount);

        Balance -= amount;

        _entries.Add(WalletEntry.Create(
            Id,
            WalletEntryType.Charge,
            -amount,
            Currency,
            invoiceId,
            "In-App charge"));

        return Result.Success;
    }

    public Result Withdraw(long amount, int minimumWithdrawalAmount, Guid payoutId)
    {
        if (amount <= 0)
            return WalletErrors.InvalidWithdrawAmount;

        if (Balance < minimumWithdrawalAmount)
            return WalletErrors.BalanceBelowMinimum(Balance, minimumWithdrawalAmount);

        if (!IsPayoutMethodConfigured)
            return WalletErrors.PayoutMethodIsNotConfigured;

        if (Balance < amount)
            return WalletErrors.InsufficientBalance(Balance, amount);

        Balance -= amount;

        _entries.Add(WalletEntry.Create(
            Id,
            WalletEntryType.Payout,
            -amount,
            Currency,
            payoutId,
            "Withdrawal / Payout"));

        LastPayoutAt = DateTime.Now;

        return Result.Success;
    }

    public Result ReverseWithdrawal(long amount, Guid payoutId)
    {
        if (amount <= 0)
            return WalletErrors.InvalidAmount;

        Balance += amount;

        _entries.Add(WalletEntry.Create(
            Id,
            WalletEntryType.PayoutReversal,
            amount,
            Currency,
            payoutId,
            "Payout failed - amount restored"));

        return Result.Success;
    }

    public void CompleteOnboarding() => IsOnboardingComplete = true;

    private static long CalculateProviderShare(long totalAmount, int platformFeePercentage)
    {
        var providerShareRatio = (100 - platformFeePercentage) / 100f;

        return (long)Math.Ceiling(totalAmount * providerShareRatio);
    }
}