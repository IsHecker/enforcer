namespace Enforcer.Modules.Billings.Infrastructure.Payouts;

public class PayoutOptions
{
    public const string SectionName = "Billings:Payout";

    public int PlatformFeePercentage { get; init; }
    public int MinimumWithdrawalAmountInCents { get; init; }
}