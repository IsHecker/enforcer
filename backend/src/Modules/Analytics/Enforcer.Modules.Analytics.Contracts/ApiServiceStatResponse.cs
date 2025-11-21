namespace Enforcer.Modules.Analytics.Contracts;

public sealed record ApiServiceStatResponse(
    Guid Id,
    Guid ApiServiceId,
    long TotalApiCalls,
    long SuccessfulApiCalls,
    long FailedApiCalls,
    float UptimePercentage,
    float AverageResponseTimeMs,
    int ActiveSubscribers,
    int TotalSubscribers,
    float AverageRating,
    int TotalRatings
);