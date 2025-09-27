using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Plans.GetPlanById;

public sealed record PlanResponse(
    Guid PlanId,
    Guid ApiServiceId,
    Guid CreatorId,
    string Name,
    string Type,
    int? Price,
    string? BillingPeriod,
    int QuotaLimit,
    string QuotaResetPeriod,
    int RateLimit,
    string RateLimitWindow,
    IEnumerable<string> Features,
    int? OveragePrice,
    int? MaxOverage,
    bool IsActive,
    int SubscriptionsCount
);

public static class PlanMapper
{
    public static PlanResponse ToResponse(this Plan plan)
    {
        return new PlanResponse(
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
            plan.Features.Content,
            plan.OveragePrice,
            plan.MaxOverage,
            plan.IsActive,
            plan.SubscriptionsCount
        );
    }
}