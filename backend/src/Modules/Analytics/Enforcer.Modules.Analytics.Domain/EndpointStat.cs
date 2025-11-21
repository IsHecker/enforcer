using System.Net;
using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Analytics.Domain;

public class EndpointStat : Entity
{
    private long _dailyCallCount;
    private DateTime _dailyCountDate;

    public Guid EndpointId { get; private set; }

    public long TotalApiCalls { get; private set; }
    public long FailedApiCalls { get; private set; }
    public float TotalResponseTimeMs { get; private set; }

    public float AverageResponseTimeMs => TotalApiCalls == 0 ? 0 : float.Round(TotalResponseTimeMs / TotalApiCalls, 3);

    public long SuccessfulApiCalls => TotalApiCalls - FailedApiCalls;

    public float ErrorRate => TotalApiCalls == 0 ? 0f : float.Round(FailedApiCalls / (float)TotalApiCalls * 100f, 2);

    public float SuccessRate => 100 - ErrorRate;

    private EndpointStat() { }

    public static EndpointStat Create(Guid endpointId)
    {
        return new EndpointStat
        {
            EndpointId = endpointId
        };
    }

    public void RecordApiCall(HttpStatusCode statusCode, float responseTimeMs)
    {
        TotalApiCalls++;
        TotalResponseTimeMs += responseTimeMs;

        if (!IsSuccessfulResponse(statusCode))
            FailedApiCalls++;

        _dailyCallCount = GetCurrentDailyCallCount();
        _dailyCallCount++;
    }

    public long GetCurrentDailyCallCount()
    {
        if (!IsNewDay())
        {
            return _dailyCallCount;
        }

        _dailyCallCount = 0;
        _dailyCountDate = DateTime.UtcNow.Date;

        return _dailyCallCount;
    }

    private bool IsNewDay() => _dailyCountDate.Date != DateTime.UtcNow.Date;

    private static bool IsSuccessfulResponse(HttpStatusCode statusCode) => statusCode < HttpStatusCode.InternalServerError;
}