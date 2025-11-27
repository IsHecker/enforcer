using Enforcer.Modules.ApiServices.Contracts.ApiUsages;
using Enforcer.Modules.ApiServices.Contracts.Plans;

namespace Enforcer.Modules.ApiServices.Contracts.Subscriptions;

public sealed record SubscriptionResponse(
    Guid Id,
    Guid ConsumerId,
    Guid PlanId,
    Guid ApiServiceId,
    string ApiKey,
    DateTime SubscribedAt,
    DateTime? ExpiresAt,
    bool IsCanceled,
    PlanResponse? Plan,
    ApiUsageResponse? ApiUsage = null!
)
{
    public bool IsExpired => ExpiresAt.HasValue && ExpiresAt < DateTime.UtcNow;
}