using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Plans.CreatePlan;

public sealed record CreatePlanCommand(
    Guid ApiServiceId,
    Guid CreatorId,
    PlanType Type,
    string Name,
    int? Price,
    BillingPeriod? BillingPeriod,
    int QuotaLimit,
    QuotaResetPeriod QuotaResetPeriod,
    int RateLimit,
    RateLimitWindow RateLimitWindow,
    IEnumerable<string> Features,
    int? OveragePrice,
    int? MaxOverage,
    int TierLevel) : ICommand<Guid>;