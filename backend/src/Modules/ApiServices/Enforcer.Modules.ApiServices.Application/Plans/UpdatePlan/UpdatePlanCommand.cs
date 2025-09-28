using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Plans.UpdatePlan;

public sealed record UpdatePlanCommand(
    Guid PlanId,
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
    int? MaxOverage
) : ICommand;