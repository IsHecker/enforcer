using Enforcer.Modules.ApiServices.Domain.Usages;

namespace Enforcer.Modules.ApiServices.Application.QuotaUsages;

public interface IQuotaUsageRepository
{
    Task<QuotaUsage?> GetBySubscriptionAndServiceAsync(
        Guid subscriptionId,
        CancellationToken cancellationToken = default);

    Task AddAsync(QuotaUsage quotaUsage, CancellationToken cancellationToken = default);
}