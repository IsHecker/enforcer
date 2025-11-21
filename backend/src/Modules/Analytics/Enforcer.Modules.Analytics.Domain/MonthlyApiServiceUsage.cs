using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Analytics.Domain;

public class MonthlyApiServiceUsage : Entity
{
    public Guid ApiServiceId { get; private set; }

    public long TotalApiCalls { get; private set; }
    public long FailedApiCalls { get; private set; }
    public float AverageResponseTimeMs { get; private set; }

    public long CallGrowthFromPreviousMonth { get; private set; }
    public int SubscriberGrowthFromPreviousMonth { get; private set; }

    public float SuccessRate => TotalApiCalls == 0 ? 0 : (TotalApiCalls - FailedApiCalls) / (float)TotalApiCalls * 100;

    private MonthlyApiServiceUsage() { }

    public static MonthlyApiServiceUsage Create(Guid apiServiceId)
    {
        return new MonthlyApiServiceUsage
        {
            ApiServiceId = apiServiceId
        };
    }
}