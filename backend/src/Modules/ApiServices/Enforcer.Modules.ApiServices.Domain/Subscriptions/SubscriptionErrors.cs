using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions;

public static class SubscriptionErrors
{
    public static Error NotFound(Guid subscriptionId) => Error.NotFound(
        "Subscription.NotFound",
        $"Subscription with ID '{subscriptionId}' was not found.");

    public static Error AlreadyOnPlan(Guid planId) => Error.Conflict(
        "Subscription.AlreadyOnPlan",
        $"The subscription is already on plan '{planId}'. Cannot switch to the same plan.");

    public static readonly Error Unauthorized = Error.Unauthorized(
        "Subscription.Unauthorized",
        "The subscription does not belong to this consumer.");

    public static readonly Error PlanDoesNotBelongToService = Error.Validation(
        "Subscription.PlanDoesNotBelongToService",
        "The selected plan does not belong to the specified API service.");

    public static readonly Error InvalidConsumerId =
        Error.Validation("Subscription.InvalidConsumerId", "ConsumerId cannot be empty.");

    public static readonly Error AlreadySubscribed =
        Error.Validation("Subscription.AlreadySubscribed", "There's an existing subscription to this service.");

    public static readonly Error AlreadyCanceled =
        Error.Validation("Subscription.AlreadyCanceled", "This subscription has already been canceled.");

    public static readonly Error AlreadyExpired =
        Error.Validation("Subscription.AlreadyExpired", "This subscription has already expired.");

    public static readonly Error InactivePlan =
        Error.Validation("Subscription.InActivePlan", "The plan is inactive and cannot be subscribed to.");

    public static readonly Error CannotRenewCanceled =
        Error.Validation("Subscription.CannotRenewCanceled", "Cannot renew a subscription that has been canceled.");

    public static readonly Error NoExpirationToRenew =
        Error.Validation("Subscription.NoExpirationToRenew", "This subscription does not have an expiration date to renew.");

    public static readonly Error CannotSwitchPlanWhenCanceled =
    Error.Validation("Subscription.CannotSwitchPlanWhenCanceled", "Cannot switch plan for a canceled subscription.");
}