using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using MediatR;

namespace Enforcer.Modules.ApiServices.Application.Plans.CreatePlan;

public sealed class CreatePlanCommandHandler(IPlanRepository planRepository)
    : ICommandHandler<CreatePlanCommand, Guid>
{

    public async Task<Result<Guid>> Handle(CreatePlanCommand request, CancellationToken cancellationToken)
    {
        var planResult = Plan.Create(
            request.ApiServiceId,
            request.CreatorId,
            request.Type,
            request.Name,
            request.Price,
            request.BillingPeriod,
            request.QuotaLimit,
            request.QuotaResetPeriod,
            request.RateLimit,
            request.RateLimitWindow,
            request.OveragePrice,
            request.MaxOverage,
            request.TierLevel
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