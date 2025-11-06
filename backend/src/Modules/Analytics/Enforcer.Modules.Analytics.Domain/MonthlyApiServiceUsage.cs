using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Analytics.Domain;

public class MonthlyApiServiceUsage : Entity
{
    public Guid ApiServiceId { get; private set; }
    public string YearMonth { get; private set; } = string.Empty;
    public long TotalApiCalls { get; private set; }
    public int ActiveSubscribers { get; private set; }
    public decimal MonthlyRevenue { get; private set; }
    public decimal MonthlySpend { get; private set; }
}