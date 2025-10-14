using Enforcer.Modules.ApiServices.Contracts.Usages;
using Enforcer.Modules.ApiServices.Domain.Usages;

namespace Enforcer.Modules.ApiServices.Application.QuotaUsages;

public static class QuotaUsageMapper
{
    public static QuotaUsageResponse ToResponse(this QuotaUsage q) =>
        new QuotaUsageResponse(q.Id, q.SubscriptionId, q.ApiServiceId, q.QuotasLeft, q.ResetAt);

    public static QuotaUsage ToDomain(this QuotaUsageResponse r) =>
        QuotaUsage.Create(r.SubscriptionId, r.ApiServiceId, r.QuotasLeft, r.ResetAt, r.QuotaUsageId).Value;
}