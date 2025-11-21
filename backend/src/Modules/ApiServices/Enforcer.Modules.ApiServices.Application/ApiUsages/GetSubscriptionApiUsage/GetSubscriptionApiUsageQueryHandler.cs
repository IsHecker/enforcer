using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Contracts.ApiUsages;
using Enforcer.Modules.ApiServices.Domain.ApiUsages;

namespace Enforcer.Modules.ApiServices.Application.ApiUsages.GetSubscriptionApiUsage;

internal sealed class GetSubscriptionApiUsageQueryHandler(IApiUsageRepository apiUsageRepository)
    : IQueryHandler<GetSubscriptionApiUsageQuery, ApiUsageResponse>
{
    public async Task<Result<ApiUsageResponse>> Handle(GetSubscriptionApiUsageQuery request, CancellationToken cancellationToken)
    {
        var apiUsage = await apiUsageRepository.GetBySubscriptionIdAsync(request.SubscriptionId, cancellationToken);

        if (apiUsage is null)
            return ApiUsageErrors.NotFound(request.SubscriptionId);

        return apiUsage.ToResponse();
    }
}