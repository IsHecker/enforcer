using Enforcer.Modules.Analytics.Contracts;
using Enforcer.Modules.Analytics.Domain;

namespace Enforcer.Modules.Analytics.Application.ApiServiceStats;

public static class ApiServiceStatMapper
{
    public static ApiServiceStatResponse ToResponse(this ApiServiceStat apiServiceStat) =>
        new()
        {
            Id = apiServiceStat.Id,
            ApiServiceId = apiServiceStat.ApiServiceId,
            ActiveSubscribers = apiServiceStat.ActiveSubscribers,
            AverageRating = apiServiceStat.AverageRating,
            AverageResponseTimeMs = apiServiceStat.AverageResponseTimeMs,
            FailedApiCalls = apiServiceStat.FailedApiCalls,
            SuccessfulApiCalls = apiServiceStat.SuccessfulApiCalls,
            TotalApiCalls = apiServiceStat.TotalApiCalls,
            TotalRatings = apiServiceStat.TotalRatings,
            TotalSubscribers = apiServiceStat.TotalSubscribers,
            UptimePercentage = apiServiceStat.UptimePercentage
        };
}