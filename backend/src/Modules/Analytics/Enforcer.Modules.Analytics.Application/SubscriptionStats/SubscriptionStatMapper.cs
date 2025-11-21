using Enforcer.Modules.Analytics.Contracts;
using Enforcer.Modules.Analytics.Domain;

namespace Enforcer.Modules.Analytics.Application.SubscriptionStats;

public static class SubscriptionStatMapper
{
    public static SubscriptionStatResponse ToResponse(this SubscriptionStat subscriptionStat) =>
        new(
            subscriptionStat.Id,
            subscriptionStat.SubscriptionId,
            subscriptionStat.TotalApiCalls,
            subscriptionStat.GetApiCallsUsedThisMonth()
        );
}