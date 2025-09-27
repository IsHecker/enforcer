using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Plans.UpdatePlan;

public sealed record UpdatePlanCommand(
    Guid PlanId,
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
    int? MaxOverage
) : ICommand;