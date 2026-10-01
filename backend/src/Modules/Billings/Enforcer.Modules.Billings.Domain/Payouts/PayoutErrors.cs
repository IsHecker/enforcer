using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.Billings.Domain.Payouts;

public static class PayoutErrors
{
    public static readonly Error InvalidTotalAmount =
        Error.Validation("Payout.InvalidTotalAmount", "Total amount cannot be negative.");

    public static readonly Error InvalidPeriod =
        Error.Validation("Payout.InvalidPeriod", "Period end cannot be before period start.");
}