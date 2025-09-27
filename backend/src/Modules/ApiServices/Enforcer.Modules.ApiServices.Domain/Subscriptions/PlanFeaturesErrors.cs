using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions;

public static class PlanFeatureErrors
{
    public static Error NotFound(Guid planFeatureId) =>
        Error.NotFound(
            code: "PlanFeature.NotFound",
            description: $"The plan features with Id '{planFeatureId}' was not found.");

    public static readonly Error EmptyFeatures =
        Error.Validation("PlanFeatures.EmptyFeatures", "At least one feature must be provided.");
}