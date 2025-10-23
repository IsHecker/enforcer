using Enforcer.Common.Application.Data;
using Enforcer.Modules.ApiServices.Domain.Usages;

namespace Enforcer.Modules.ApiServices.Application.QuotaUsages;

public interface IQuotaUsageRepository : IRepository<QuotaUsage>
{
    Task<QuotaUsage?> GetBySubscriptionIdAsync(
        Guid subscriptionId,
        CancellationToken cancellationToken = default);
}