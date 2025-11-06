using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Contracts.Usages;
using Enforcer.Modules.ApiServices.Domain.Usages;

namespace Enforcer.Modules.ApiServices.Application.QuotaUsages.GetSubscriptionQuotaUsage;

internal sealed class GetSubscriptionQuotaUsageQueryHandler(IQuotaUsageRepository quotaRepository)
    : IQueryHandler<GetSubscriptionQuotaUsageQuery, QuotaUsageResponse>
{
    public async Task<Result<QuotaUsageResponse>> Handle(GetSubscriptionQuotaUsageQuery request, CancellationToken cancellationToken)
    {
        var quotaUsage = await quotaRepository.GetBySubscriptionIdAsync(request.SubscriptionId, cancellationToken);

        if (quotaUsage is null)
            return QuotaUsageErrors.NotFound(request.SubscriptionId);

        return quotaUsage.ToResponse();
    }
}