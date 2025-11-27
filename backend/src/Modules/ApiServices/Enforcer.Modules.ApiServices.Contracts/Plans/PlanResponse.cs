using Enforcer.Common.Domain.Enums.ApiServices;

namespace Enforcer.Modules.ApiServices.Contracts.Plans;

public sealed record PlanResponse(
    Guid Id,
    Guid ApiServiceId,
    Guid CreatorId,
    string Name,
    string Type,
    long PriceInCents,
    string? BillingPeriod,
    int QuotaLimit,
    string QuotaResetPeriod,
    int RateLimit,
    RateLimitWindow RateLimitWindow,
    IEnumerable<string>? Features,
    long? OveragePriceInCents,
    int? MaxOverage,
    bool IsActive,
    int TierLevel
);