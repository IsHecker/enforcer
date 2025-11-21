using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Analytics.Domain;

public class SubscriptionStat : Entity
{
    private long _apiCallsUsedThisMonth;
    private DateTime _monthUsageDate;

    public Guid SubscriptionId { get; private set; }
    public long TotalApiCalls { get; private set; }

    public static SubscriptionStat Create(Guid subscriptionId)
    {
        return new SubscriptionStat
        {
            SubscriptionId = subscriptionId
        };
    }

    public void RecordApiCall()
    {
        TotalApiCalls++;

        _apiCallsUsedThisMonth = GetApiCallsUsedThisMonth();
        _apiCallsUsedThisMonth++;
    }

    public long GetApiCallsUsedThisMonth()
    {
        if (!IsNewMonth())
            return _apiCallsUsedThisMonth;

        _apiCallsUsedThisMonth = 0;
        _monthUsageDate = DateTime.UtcNow.Date;

        return _apiCallsUsedThisMonth;
    }

    private bool IsNewMonth() => _monthUsageDate.Month != DateTime.UtcNow.Month
        || _monthUsageDate.Year != DateTime.UtcNow.Year;
}