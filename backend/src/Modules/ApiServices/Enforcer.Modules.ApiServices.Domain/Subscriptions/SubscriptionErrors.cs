using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions;

public static class SubscriptionErrors
{
    public static Error NotFound(Guid subscriptionId) => Error.NotFound(
        "Subscription.NotFound",
        $"Subscription with ID '{subscriptionId}' was not found.");

    public static readonly Error Unauthorized = Error.Unauthorized(
        "Subscription.Unauthorized",
        "The subscription does not belong to this consumer.");

    public static readonly Error InvalidConsumerId =
        Error.Validation("Subscription.InvalidConsumerId", "ConsumerId cannot be empty.");

    public static Error AlreadyCanceled =>
        Error.Validation("Subscription.AlreadyCanceled", "This subscription has already been canceled.");

    public static Error AlreadyExpired =>
        Error.Validation("Subscription.AlreadyExpired", "This subscription has already expired.");

    public static Error InvalidPlan =>
        Error.Validation("Subscription.InvalidPlan", "The provided plan is invalid.");

    public static Error CannotRenewCanceled =>
        Error.Validation("Subscription.CannotRenewCanceled", "Cannot renew a subscription that has been canceled.");

    public static Error NoExpirationToRenew =>
        Error.Validation("Subscription.NoExpirationToRenew", "This subscription does not have an expiration date to renew.");

    public static Error CannotChangePlanWhenCanceled =>
    Error.Validation("Subscription.CannotChangePlanWhenCanceled", "Cannot change plan for a canceled subscription.");
}