using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.Plans;

public sealed class PlanFeature : Entity
{
    public IReadOnlyList<string> Content { get; private set; } = [];

    private PlanFeature() { }

    public static Result<PlanFeature> Create(IEnumerable<string> features)
    {
        if (features is null || !features.Any())
            return PlanFeatureErrors.EmptyFeatures;

        var planFeatures = new PlanFeature
        {
            Content = features.Distinct().ToList()
        };

        return planFeatures;
    }

    public Result UpdateFeatures(IEnumerable<string> features)
    {
        if (features is null || !features.Any())
            return PlanFeatureErrors.EmptyFeatures;

        Content = features.Distinct().ToList();

        return Result.Success;
    }
}