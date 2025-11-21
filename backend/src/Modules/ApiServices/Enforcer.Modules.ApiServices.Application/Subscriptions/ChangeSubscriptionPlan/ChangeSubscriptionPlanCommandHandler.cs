using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.Plans;
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

        var targetPlanId = request.TargetPlanId;

        if (subscription.PlanId == targetPlanId)
            return SubscriptionErrors.AlreadyOnPlan(targetPlanId);

        var targetPlan = await planRepository.GetByIdAsync(targetPlanId, cancellationToken);

        if (targetPlan is null)
            return PlanErrors.NotFound(targetPlanId);

        if (targetPlan.ApiServiceId != subscription.ApiServiceId)
            return PlanErrors.PlanDoesNotBelongToService;

        var changePlanResult = subscription.ChangePlan(targetPlan);

        if (changePlanResult.IsFailure)
            return changePlanResult.Error;

        subscriptionRepository.Update(subscription);

        return Result.Success;
    }
}