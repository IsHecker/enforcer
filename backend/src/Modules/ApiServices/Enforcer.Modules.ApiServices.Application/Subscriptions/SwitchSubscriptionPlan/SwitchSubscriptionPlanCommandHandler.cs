using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Application.Plans;
using Enforcer.Modules.ApiServices.Application.Subscriptions;
using Enforcer.Modules.ApiServices.Domain.Plans;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Enforcer.Modules.Billings.PublicApi;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.SwitchSubscriptionPlan;

internal sealed class SwitchSubscriptionPlanCommandHandler(
    IApiServicesDbContext context,
    IPlanRepository planRepository,
    IBillingsApi billingsApi) : ICommandHandler<SwitchSubscriptionPlanCommand>
{
    public async Task<Result> Handle(SwitchSubscriptionPlanCommand request, CancellationToken cancellationToken)
    {
        var subscription = await GetSubscriptionAsync(request.SubscriptionId, cancellationToken);
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

        var billingResult = await billingsApi.ProcessPlanSwitchBillingAsync(
            subscription.ToResponse(),
            targetPlan.ToResponse(),
            cancellationToken
        );

        if (billingResult.IsFailure)
            return billingResult.Error;

        var switchPlanResult = subscription.SwitchPlan(targetPlan);

        if (switchPlanResult.IsFailure)
            return switchPlanResult.Error;

        context.Subscriptions.Update(subscription);

        return Result.Success;
    }

    private async Task<Subscription?> GetSubscriptionAsync(Guid subscriptionId, CancellationToken cancellationToken)
    {
        return await context.Subscriptions
            .AsNoTracking()
            .Include(sub => sub.Plan)
            .Include(sub => sub.ApiUsage)
            .FirstOrDefaultAsync(sub => sub.Id == subscriptionId, cancellationToken);
    }
}