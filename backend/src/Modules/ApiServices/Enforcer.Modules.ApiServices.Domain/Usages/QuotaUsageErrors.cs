using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.Usages;

public static class QuotaUsageErrors
{
    public static Error NotFound(Guid subscriptionId) =>
        Error.NotFound("QuotaUsage.NotFound", $"Quota usage with subscription id '{subscriptionId}' was not found.");

    public static Error QuotaExceeded(string resetPeriod) =>
        Error.TooManyRequests("QuotaUsage.QuotaExceeded", $"{resetPeriod} quota exceeded. Please upgrade your plan.");
    public static readonly Error InvalidSubscriptionId =
        Error.Validation("QuotaUsage.InvalidSubscriptionId", "SubscriptionId cannot be empty.");

    public static readonly Error InvalidInitialQuota =
        Error.Validation("QuotaUsage.InvalidInitialQuota", "Initial quota cannot be negative.");

    public static readonly Error InvalidResetQuota =
        Error.Validation("QuotaUsage.InvalidResetQuota", "Reset quota cannot be negative.");

    public static readonly Error InvalidConsumptionAmount =
        Error.Validation("QuotaUsage.InvalidConsumptionAmount", "Consumption amount must be greater than zero.");

    public static readonly Error InvalidResetDate =
        Error.Validation("QuotaUsage.InvalidResetDate", "Reset date must be in the future.");

    public static readonly Error InvalidResetPeriod =
        Error.Validation("QuotaUsage.InvalidResetPeriod", "Invalid reset period specified");
}
