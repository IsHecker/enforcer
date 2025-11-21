using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.ApiUsages;

public static class ApiUsageErrors
{
    public static Error NotFound(Guid subscriptionId) =>
        Error.NotFound("ApiUsage.NotFound", $"Quota usage with subscription id '{subscriptionId}' was not found.");

    public static Error QuotaExceeded(string resetPeriod) =>
        Error.TooManyRequests("ApiUsage.QuotaExceeded", $"{resetPeriod} quota exceeded. Please upgrade your plan.");
    public static readonly Error InvalidSubscriptionId =
        Error.Validation("ApiUsage.InvalidSubscriptionId", "SubscriptionId cannot be empty.");

    public static readonly Error InvalidInitialQuota =
        Error.Validation("ApiUsage.InvalidInitialQuota", "Initial quota cannot be negative.");

    public static readonly Error InvalidResetQuota =
        Error.Validation("ApiUsage.InvalidResetQuota", "Reset quota cannot be negative.");

    public static readonly Error InvalidConsumptionAmount =
        Error.Validation("ApiUsage.InvalidConsumptionAmount", "Consumption amount must be greater than zero.");

    public static readonly Error InvalidResetDate =
        Error.Validation("ApiUsage.InvalidResetDate", "Reset date must be in the future.");

    public static Error OverageCapReached(int maxOverage) =>
        Error.Validation(
            "ApiUsage.OverageCapReached",
            $"Overage limit reached. Maximum {maxOverage} additional requests allowed beyond your quota");
}
