namespace Enforcer.Modules.Analytics.Contracts;

public class EndpointStatResponse
{
    public Guid Id { get; init; }
    public Guid EndpointId { get; init; }
    public long TotalApiCalls { get; init; }
    public long SuccessfulApiCalls { get; init; }
    public long FailedApiCalls { get; init; }
    public long DailyCallCount { get; init; }
    public float SuccessRate { get; init; }
    public float ErrorRate { get; init; }
    public float AverageResponseTimeMs { get; init; }
}