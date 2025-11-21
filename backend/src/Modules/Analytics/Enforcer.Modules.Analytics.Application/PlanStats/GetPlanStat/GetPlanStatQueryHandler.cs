using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Analytics.Contracts;

namespace Enforcer.Modules.Analytics.Application.PlanStats.GetPlanStat;

public sealed class GetPlanStatQueryHandler(IPlanStatRepository planStatRepository)
    : IQueryHandler<GetPlanStatQuery, PlanStatResponse>
{
    public async Task<Result<PlanStatResponse>> Handle(GetPlanStatQuery request, CancellationToken cancellationToken)
    {
        var planStat = await planStatRepository.GetByPlanIdAsync(
            request.PlanId,
            cancellationToken);

        if (planStat is null)
            return Error.NotFound(
                "PlanStat.NotFound",
                $"Plan stat for Plan with ID '{request.PlanId}' was not found.");

        return planStat.ToResponse();
    }
}