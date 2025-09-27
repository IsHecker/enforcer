using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Plans.UpdatePlan;

public class UpdatePlanCommandHandler(IPlanRepository planRepository) : ICommandHandler<UpdatePlanCommand>
{
    public async Task<Result> Handle(UpdatePlanCommand request, CancellationToken cancellationToken)
    {
        var plan = await planRepository.GetByIdAsync(request.PlanId, cancellationToken);
        if (plan is null)
            return PlanErrors.NotFound(request.PlanId);

        plan.UpdateDetails(
            request.Type,
            request.Name,
            request.Price,
            request.BillingPeriod,
            request.QuotaLimit,
            request.QuotaResetPeriod,
            request.RateLimit,
            request.RateLimitWindow,
            request.OveragePrice,
            request.MaxOverage
        );

        var planFeatures = await planRepository.GetFeatureByFeatureIdAsync(plan.FeaturesId, cancellationToken);
        if (planFeatures is null)
            return PlanFeatureErrors.NotFound(plan.FeaturesId);

        var updateFeaturesResult = planFeatures.UpdateFeatures(request.Features);
        if (updateFeaturesResult.IsFailure)
            return updateFeaturesResult;

        await planRepository.UpdateAsync(plan, cancellationToken);

        return Result.Success;
    }
}