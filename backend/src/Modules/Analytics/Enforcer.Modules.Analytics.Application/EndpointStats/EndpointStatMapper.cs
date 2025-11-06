using Enforcer.Modules.Analytics.Contracts;
using Enforcer.Modules.Analytics.Domain;

namespace Enforcer.Modules.Analytics.Application.EndpointStats;

public static class EndpointStatMapper
{
    public static EndpointStatResponse ToResponse(this EndpointStat endpointStat) =>
        new()
        {
            Id = endpointStat.Id,
            EndpointId = endpointStat.EndpointId,
            TotalApiCalls = endpointStat.TotalApiCalls,
            SuccessfulApiCalls = endpointStat.SuccessfulApiCalls,
            FailedApiCalls = endpointStat.FailedApiCalls,
            DailyCallCount = endpointStat.GetCurrentDailyCallCount(),
            SuccessRate = endpointStat.SuccessRate,
            ErrorRate = endpointStat.ErrorRate,
            AverageResponseTimeMs = endpointStat.AverageResponseTimeMs,
        };
}