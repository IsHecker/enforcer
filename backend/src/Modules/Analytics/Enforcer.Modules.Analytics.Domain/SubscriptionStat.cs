using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Analytics.Domain;

public class SubscriptionStat : Entity
{
    public Guid SubscriptionId { get; private set; }
    public long TotalApiCalls { get; private set; }
    public long ApiCallsUsedThisMonth { get; private set; }
    public decimal MonthlyUsageRate { get; private set; }
    public int DaysRemainingInBilling { get; private set; }
    public decimal CurrentBill { get; private set; }
    public decimal MonthlySpend { get; private set; }
    public DateTime MonthUsageDate { get; private set; }

    public void RecordApiCall()
    {
        TotalApiCalls++;

        // Reset monthly counter if new month
        if (MonthUsageDate.Month != DateTime.UtcNow.Month ||
            MonthUsageDate.Year != DateTime.UtcNow.Year)
        {
            ApiCallsUsedThisMonth = 0;
            MonthUsageDate = DateTime.UtcNow.Date;
        }

        ApiCallsUsedThisMonth++;
        UpdatedAt = DateTime.UtcNow;
    }
}