using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Analytics.Domain;

public class DailyApiServiceUsage : Entity
{
    public Guid ApiServiceId { get; private set; }

    public long TotalApiCalls { get; private set; }
    public long FailedApiCalls { get; private set; }
    public float AverageResponseTimeMs { get; private set; }

    public int UniqueConsumers { get; private set; }
    public int ActiveSubscriptions { get; private set; }

    public float SuccessRate => TotalApiCalls == 0 ? 0 : (TotalApiCalls - FailedApiCalls) / (float)TotalApiCalls * 100;

    private DailyApiServiceUsage() { }

    public static DailyApiServiceUsage Create(Guid apiServiceId)
    {
        return new DailyApiServiceUsage
        {
            ApiServiceId = apiServiceId
        };
    }
}