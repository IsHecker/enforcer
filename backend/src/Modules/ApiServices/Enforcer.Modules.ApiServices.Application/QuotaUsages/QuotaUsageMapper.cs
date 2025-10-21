using Enforcer.Modules.ApiServices.Contracts.Usages;
using Enforcer.Modules.ApiServices.Domain.Usages;

namespace Enforcer.Modules.ApiServices.Application.QuotaUsages;

public static class QuotaUsageMapper
{
    public static QuotaUsageResponse ToResponse(this QuotaUsage q) =>
        new QuotaUsageResponse(q.Id, q.SubscriptionId, q.QuotasLeft, q.ResetAt);
}