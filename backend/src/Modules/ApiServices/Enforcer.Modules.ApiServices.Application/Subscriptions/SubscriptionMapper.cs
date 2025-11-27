using Enforcer.Modules.ApiServices.Application.ApiUsages;
using Enforcer.Modules.ApiServices.Application.Plans;
using Enforcer.Modules.ApiServices.Application.Subscriptions;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions;

public static class SubscriptionMapper
{
    public static SubscriptionResponse ToResponse(this Subscription s) =>
        new(
            s.Id,
            s.ConsumerId,
            s.PlanId,
            s.ApiServiceId,
            s.ApiKey,
            s.SubscribedAt,
            s.ExpiresAt,
            s.IsCanceled,
            s.Plan?.ToResponse(),
            s.ApiUsage?.ToResponse());
}