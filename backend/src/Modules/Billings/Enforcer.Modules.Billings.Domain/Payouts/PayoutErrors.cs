using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.Billings.Domain.Payouts;

public static class PayoutErrors
{
    public static readonly Error InvalidTotalAmound =
        Error.Validation("Payout.InvalidTotalAmound", "Total amount cannot be negative.");
}