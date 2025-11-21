using Enforcer.Modules.Analytics.Contracts;
using Enforcer.Modules.Analytics.Domain;

namespace Enforcer.Modules.Analytics.Application.PlanStats;

public static class PlanStatMapper
{
    public static PlanStatResponse ToResponse(this PlanStat planStat) =>
        new(
            planStat.Id,
            planStat.PlanId,
            planStat.TotalSubscribers,
            planStat.ActiveSubscribers,
            planStat.GetCancellationsThisMonth(),
            planStat.CancellationPercentage
        );
}