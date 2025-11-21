using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Plans.UpdatePlan;

public sealed record UpdatePlanCommand(
    Guid PlanId,
    string PlanType,
    string Name,
    long PriceInCents,
    string? BillingPeriod,
    int QuotaLimit,
    string QuotaResetPeriod,
    int RateLimit,
    string RateLimitWindow,
    bool IsActive,
    IEnumerable<string> Features,
    float? OveragePrice,
    int? MaxOverage,
    int TierLevel
) : ICommand;