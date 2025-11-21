using Enforcer.Common.Application.Extensions;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Domain.Plans;

namespace Enforcer.Modules.ApiServices.Application.Plans;

public static class PlanMapper
{
    public static Plan ToDomain(this PlanResponse response) =>
        Plan.Create(
            response.ApiServiceId,
            response.CreatorId,
            response.Type.ToEnum<PlanType>(),
            response.Name,
            response.PriceInCents,
            response.QuotaLimit,
            response.QuotaResetPeriod.ToEnum<QuotaResetPeriod>(),
            response.RateLimit,
            response.RateLimitWindow,
            response.TierLevel,
            response.BillingPeriod?.ToEnum<BillingPeriod>(),
            response.OveragePrice,
            response.MaxOverage
        ).Value;

    public static PlanResponse ToResponse(this Plan plan) =>
        new(
            plan.Id,
            plan.ApiServiceId,
            plan.CreatorId,
            plan.Name,
            plan.Type.ToString(),
            plan.PriceInCents,
            plan.BillingPeriod != null ? plan.BillingPeriod.ToString() : null,
            plan.QuotaLimit,
            plan.QuotaResetPeriod.ToString(),
            plan.RateLimit,
            plan.RateLimitWindow,
            plan.Features?.Content,
            plan.OveragePrice,
            plan.MaxOverage,
            plan.IsActive,
            plan.TierLevel);
}