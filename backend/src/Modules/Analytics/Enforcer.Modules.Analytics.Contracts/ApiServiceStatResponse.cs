namespace Enforcer.Modules.Analytics.Contracts;

public class ApiServiceStatResponse
{
    public Guid Id { get; init; }
    public Guid ApiServiceId { get; init; }
    public long TotalApiCalls { get; init; }
    public long SuccessfulApiCalls { get; init; }
    public long FailedApiCalls { get; init; }
    public float UptimePercentage { get; init; }
    public float AverageResponseTimeMs { get; init; }
    public int ActiveSubscribers { get; init; }
    public int TotalSubscribers { get; init; }
    public float AverageRating { get; init; }
    public int TotalRatings { get; init; }
}