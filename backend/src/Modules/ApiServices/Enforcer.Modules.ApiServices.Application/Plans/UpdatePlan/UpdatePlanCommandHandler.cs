using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Enums.ApiServices;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.Plans;

namespace Enforcer.Modules.ApiServices.Application.Plans.UpdatePlan;

internal sealed class UpdatePlanCommandHandler(IPlanRepository planRepository) : ICommandHandler<UpdatePlanCommand>
{
    public async Task<Result> Handle(UpdatePlanCommand request, CancellationToken cancellationToken)
    {
        var plan = await planRepository.GetByIdAsync(request.PlanId, cancellationToken);
        if (plan is null)
            return PlanErrors.NotFound(request.PlanId);

        var updateResult = plan.Update(
            request.PlanType.ToEnum<PlanType>(),
            request.Name,
            request.PriceInCents,
            request.BillingPeriod?.ToEnum<BillingPeriod>(),
            request.QuotaLimit,
            request.QuotaResetPeriod.ToEnum<QuotaResetPeriod>(),
            request.RateLimit,
            request.RateLimitWindow.ToEnum<RateLimitWindow>(),
            request.IsActive,
            request.OveragePriceInCents,
            request.MaxOverage,
            request.TierLevel
        );

        if (updateResult.IsFailure)
            return updateResult.Error;

        var planFeatures = await planRepository.GetFeatureByFeatureIdAsync(plan.FeaturesId, cancellationToken);
        if (planFeatures is null)
            return PlanFeatureErrors.NotFound(plan.FeaturesId);

        var updateFeaturesResult = planFeatures.UpdateFeatures(request.Features);
        if (updateFeaturesResult.IsFailure)
            return updateFeaturesResult;

        planRepository.Update(plan);

        return Result.Success;
    }
}