using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.Billings.Domain.Wallets;

public static class WalletErrors
{
    public static Error NotFound(Guid id) =>
        Error.NotFound("Wallet.NotFound", $"Wallet with ID '{id}' was not found.");

    public static Error NotFoundByUser(Guid id) =>
        Error.NotFound("Wallet.NotFound", $"User does not own a wallet with ID '{id}' was not found.");

    public static readonly Error InvalidEarningAmount =
        Error.Validation(
            "Wallet.InvalidEarningAmount",
            "Earnings amount must be greater than zero");

    public static readonly Error InvalidCreditAmount =
        Error.Validation(
            "Wallet.InvalidCreditAmount",
            "Credit amount must be greater than zero");

    public static readonly Error InvalidChargeAmount =
        Error.Validation(
            "Wallet.InvalidChargeAmount",
            "The charge amount must be greater than zero.");

    public static readonly Error InvalidWithdrawAmount =
        Error.Validation(
            "Wallet.InvalidWithdrawAmount",
            "Withdrawal amount must be greater than zero");

    public static readonly Error InvalidAmount =
        Error.Validation(
            "Wallet.InvalidAmount",
            "Amount must be greater than zero");

    public static readonly Error PayoutMethodIsNotConfigured =
        Error.Validation(
            "Wallet.PayoutMethodIsNotConfigured",
            "No payout method is configured for this wallet. Please set up a payout method before withdrawing.");

    public static Error BalanceBelowMinimum(long balance, int minimum) =>
        Error.Validation(
            "Wallet.BalanceBelowMinimum",
            $"Your balance (${balance / 100m:F2}) is below the minimum withdrawal amount ({minimum}).");

    public static Error InsufficientBalance(long balance, long requested) =>
        Error.Validation(
            "Wallet.InsufficientBalance",
            $"Insufficient balance. Available: ${balance / 100m:F2}, Requested: ${requested / 100m:F2}");

    public static Error InsufficientCredits(long credits, long requested) =>
        Error.Validation(
            "Wallet.InsufficientCredits",
            $"Insufficient credits. Available: ${credits / 100m:F2}, Requested: ${requested / 100m:F2}");
}