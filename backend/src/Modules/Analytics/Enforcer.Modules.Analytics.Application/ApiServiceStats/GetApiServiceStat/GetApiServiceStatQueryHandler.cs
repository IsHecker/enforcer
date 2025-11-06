using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Analytics.Contracts;
using Enforcer.Modules.Analytics.Domain;

namespace Enforcer.Modules.Analytics.Application.ApiServiceStats.GetApiServiceStat;

public class GetApiServiceStatQueryHandler(IApiServiceStatRepository serviceStatRepository)
    : IQueryHandler<GetApiServiceStatQuery, ApiServiceStatResponse>
{
    public async Task<Result<ApiServiceStatResponse>> Handle(GetApiServiceStatQuery request, CancellationToken cancellationToken)
    {
        var apiServiceStat = await serviceStatRepository.GetByApiServiceIdAsync(request.ApiServiceId, cancellationToken);

        if (apiServiceStat is null)
            return ApiServiceStatErrors.NotFound(request.ApiServiceId);

        return apiServiceStat.ToResponse();
    }
}