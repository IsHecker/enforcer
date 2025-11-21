namespace Enforcer.Modules.Analytics.Contracts;

public sealed record EndpointStatResponse(
    Guid Id,
    Guid EndpointId,
    long TotalApiCalls,
    long SuccessfulApiCalls,
    long FailedApiCalls,
    long DailyCallCount,
    float SuccessRate,
    float ErrorRate,
    float AverageResponseTimeMs
);