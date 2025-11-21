using Enforcer.Modules.Analytics.Contracts;
using Enforcer.Modules.Analytics.Domain;

namespace Enforcer.Modules.Analytics.Application.EndpointStats;

public static class EndpointStatMapper
{
    public static EndpointStatResponse ToResponse(this EndpointStat endpointStat) =>
        new(
            endpointStat.Id,
            endpointStat.EndpointId,
            endpointStat.TotalApiCalls,
            endpointStat.SuccessfulApiCalls,
            endpointStat.FailedApiCalls,
            endpointStat.GetCurrentDailyCallCount(),
            endpointStat.SuccessRate,
            endpointStat.ErrorRate,
            endpointStat.AverageResponseTimeMs
        );
}