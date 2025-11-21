using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.Plans;

public static class PlanErrors
{
    public static Error NotFound(Guid planId) =>
        Error.NotFound(
            "Plan.NotFound",
            $"The plan with Id '{planId}' was not found.");

    public static readonly Error InvalidApiServiceId =
        Error.Validation("Plan.InvalidApiServiceId", "The ApiServiceId cannot be empty.");

    public static readonly Error InvalidCreatorId =
        Error.Validation("Plan.InvalidCreatorId", "The CreatorId cannot be empty.");

    public static readonly Error EmptyName =
        Error.Validation("Plan.EmptyName", "The name of the plan cannot be empty.");

    public static readonly Error AlreadyDeleted =
        Error.Validation("Plan.AlreadyDeleted", "The plan is already set for delete.");

    public static readonly Error InvalidTierLevel =
        Error.Validation("Plan.InvalidTierLevel", "Tier level can't be less than 1.");

    public static readonly Error NoSubscriptionsToRemove =
        Error.Conflict("Plan.NoSubscriptionsToRemove", "No subscriptions to remove.");

    public static Error PlanDoesNotBelongToService =>
        Error.Validation("Plan.InvalidService", "The target plan does not belong to the same API service.");
}