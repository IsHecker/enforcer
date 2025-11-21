using Enforcer.Modules.ApiServices.Contracts.ApiUsages;
using Enforcer.Modules.ApiServices.Domain.ApiUsages;

namespace Enforcer.Modules.ApiServices.Application.ApiUsages;

public static class ApiUsageMapper
{
    public static ApiUsageResponse ToResponse(this ApiUsage q) =>
        new(q.Id, q.SubscriptionId, q.QuotasLeft, q.OverageUsed, q.ResetAt);
}