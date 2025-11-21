using Enforcer.Modules.Analytics.Contracts;
using Enforcer.Modules.Analytics.Domain;

namespace Enforcer.Modules.Analytics.Application.ApiServiceStats;

public static class ApiServiceStatMapper
{
    public static ApiServiceStatResponse ToResponse(this ApiServiceStat apiServiceStat) =>
        new(
            apiServiceStat.Id,
            apiServiceStat.ApiServiceId,
            apiServiceStat.TotalApiCalls,
            apiServiceStat.SuccessfulApiCalls,
            apiServiceStat.FailedApiCalls,
            apiServiceStat.UptimePercentage,
            apiServiceStat.AverageResponseTimeMs,
            apiServiceStat.ActiveSubscribers,
            apiServiceStat.TotalSubscribers,
            apiServiceStat.AverageRating,
            apiServiceStat.TotalRatings
        );
}