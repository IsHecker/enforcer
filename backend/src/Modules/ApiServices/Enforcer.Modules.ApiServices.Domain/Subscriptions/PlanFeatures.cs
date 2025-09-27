using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions;

public class PlanFeature : Entity
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

        planFeatures.Raise(new PlanFeaturesCreatedEvent(planFeatures.Id, planFeatures.Content));

        return planFeatures;
    }

    public Result UpdateFeatures(IEnumerable<string> features)
    {
        if (features is null || !features.Any())
            return PlanFeatureErrors.EmptyFeatures;

        Content = features.Distinct().ToList();

        Raise(new PlanFeaturesUpdatedEvent(Id, Content));

        return Result.Success;
    }
}