using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Enums.ApiServices;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Plans.CreatePlan;

internal sealed class CreatePlanCommandHandler(IPlanRepository planRepository)
    : ICommandHandler<CreatePlanCommand, Guid>
{

    public async Task<Result<Guid>> Handle(CreatePlanCommand request, CancellationToken cancellationToken)
    {
        var planResult = Plan.Create(
            request.ApiServiceId,
            request.CreatorId,
            request.PlanType.ToEnum<PlanType>(),
            request.Name,
            request.Price,
            request.QuotaLimit,
            request.QuotaResetPeriod.ToEnum<QuotaResetPeriod>(),
            request.RateLimit,
            request.RateLimitWindow.ToEnum<RateLimitWindow>(),
            request.TierLevel,
            request.BillingPeriod?.ToEnum<BillingPeriod>(),
            request.OveragePrice,
            request.MaxOverage
        );

        if (planResult.IsFailure)
            return planResult.Error;

        var plan = planResult.Value;
        await planRepository.AddAsync(plan, cancellationToken);

        var featuresResult = PlanFeature.Create(request.Features);
        if (featuresResult.IsFailure)
            return featuresResult.Error;

        var features = featuresResult.Value;
        await planRepository.AddFeatureAsync(features, cancellationToken);

        plan.SetFeaturesId(features.Id);
        return plan.Id;
    }
}