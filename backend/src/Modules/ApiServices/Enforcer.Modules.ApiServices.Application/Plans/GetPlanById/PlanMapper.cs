using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Plans.GetPlanById;

public static class PlanMapper
{
    public static PlanResponse ToResponse(this Plan plan) => new PlanResponse(
            plan.Id,
            plan.ApiServiceId,
            plan.CreatorId,
            plan.Name,
            plan.Type.ToString(),
            plan.Price,
            plan.BillingPeriod != null ? plan.BillingPeriod.ToString() : null,
            plan.QuotaLimit,
            plan.QuotaResetPeriod.ToString(),
            plan.RateLimit,
            plan.RateLimitWindow.ToString(),
            plan.Features?.Content,
            plan.OveragePrice,
            plan.MaxOverage,
            plan.IsActive,
            plan.SubscriptionsCount,
            plan.TierLevel
        );
}