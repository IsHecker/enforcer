using Enforcer.Common.Domain.Enums.ApiServices;

namespace Enforcer.Modules.ApiServices.Contracts.Plans;

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
    RateLimitWindow RateLimitWindow,
    IEnumerable<string>? Features,
    int? OveragePrice,
    int? MaxOverage,
    bool IsActive,
    int SubscriptionsCount,
    int TierLevel
);