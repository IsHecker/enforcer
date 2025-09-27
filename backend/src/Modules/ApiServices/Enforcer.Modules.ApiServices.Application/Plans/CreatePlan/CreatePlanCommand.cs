using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Plans.CreatePlan;

public sealed record CreatePlanCommand(
    Guid ApiServiceId,
    Guid CreatorId,
    PlanTypes Type,
    string Name,
    int? Price,
    BillingPeriods? BillingPeriod,
    int QuotaLimit,
    QuotaResetPeriods QuotaResetPeriod,
    int RateLimit,
    RateLimitWindows RateLimitWindow,
    IEnumerable<string> Features,
    int? OveragePrice,
    int? MaxOverage,
    int TierLevel) : ICommand<Guid>;