using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Plans.CreatePlan;

public readonly record struct CreatePlanCommand(
    Guid ApiServiceId,
    Guid CreatorId,
    string PlanType,
    string Name,
    int? Price,
    string? BillingPeriod,
    int QuotaLimit,
    string QuotaResetPeriod,
    int RateLimit,
    string RateLimitWindow,
    IEnumerable<string> Features,
    int? OveragePrice,
    int? MaxOverage,
    int TierLevel
) : ICommand<Guid>;