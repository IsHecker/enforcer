using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.Billings.Domain.PromotionalCodes;

public static class PromotionalCodeErrors
{
    public static Error NotFound(string promoCode) =>
        Error.NotFound(
            "PromotionalCode.NotFound",
            $"Promotional code '{promoCode}' was not found.");

    public static readonly Error Expired =
        Error.Validation("PromotionalCode.Expired", "This promotional code is expired.");

    public static readonly Error MaxUsesReached =
        Error.Validation(
            "PromotionalCode.MaxUsesReached",
            "The maximum number of uses for this promotional code has been reached.");

    public static readonly Error MaxUsesPerCustomerReached =
        Error.Validation(
            "PromotionalCode.MaxUsesPerCustomerReached",
            "You have exceeded the maximum uses allowed for this promotional code.");
}