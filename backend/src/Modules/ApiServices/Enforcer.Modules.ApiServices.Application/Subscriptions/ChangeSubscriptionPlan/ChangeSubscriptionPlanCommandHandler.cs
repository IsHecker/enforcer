using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Plans;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.ChangeSubscriptionPlan;

internal sealed class ChangeSubscriptionPlanCommandHandler(
    ISubscriptionRepository subscriptionRepository,
    IPlanRepository planRepository) : ICommandHandler<ChangeSubscriptionPlanCommand>
{

    public async Task<Result> Handle(ChangeSubscriptionPlanCommand request, CancellationToken cancellationToken)
    {
        var subscription = await subscriptionRepository.GetByIdAsync(request.SubscriptionId, cancellationToken);
        if (subscription is null)
            return SubscriptionErrors.NotFound(request.SubscriptionId);

        var targetPlan = await planRepository.GetByIdAsync(request.TargetPlanId, cancellationToken);
        if (targetPlan is null)
            return PlanErrors.NotFound(request.TargetPlanId);

        if (targetPlan.ApiServiceId != subscription.ApiServiceId)
            return PlanErrors.PlanDoesNotBelongToService;

        if (!targetPlan.IsActive)
            return PlanErrors.InactivePlan;

        var changePlanResult = subscription.ChangePlan(targetPlan);
        if (changePlanResult.IsFailure)
            return changePlanResult.Error;

        await subscriptionRepository.UpdateAsync(subscription, cancellationToken);

        return Result.Success;
    }
}