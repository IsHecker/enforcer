using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions;

public static class PlanErrors
{
    public static Error NotFound(Guid planId) =>
        Error.NotFound(
            code: "Plan.NotFound",
            description: $"The plan with Id '{planId}' was not found.");

    public static readonly Error InvalidApiServiceId =
        Error.Validation("Plan.InvalidApiServiceId", "The ApiServiceId cannot be empty.");

    public static readonly Error InvalidCreatorId =
        Error.Validation("Plan.InvalidCreatorId", "The CreatorId cannot be empty.");

    public static readonly Error EmptyName =
        Error.Validation("Plan.EmptyName", "The name of the plan cannot be empty.");

    public static readonly Error InactivePlan =
        Error.Validation("Plan.Inactive", "The plan is inactive and cannot be subscribed to.");

    public static readonly Error AlreadyActive =
        Error.Conflict("Plan.AlreadyActive", "The plan is already active.");

    public static readonly Error AlreadyInactive =
        Error.Conflict("Plan.AlreadyInactive", "The plan is already inactive.");

    public static readonly Error NoSubscriptionsToRemove =
        Error.Conflict("Plan.NoSubscriptionsToRemove", "No subscriptions to remove.");

    public static Error PlanDoesNotBelongToService =>
        Error.Validation("Plan.InvalidService", "The target plan does not belong to the same API service.");

    public static Error InvalidSortOrder =>
        Error.Validation("Plan.InvalidSortOrder", "SortOrder must be non-negative.");
}