using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Analytics.Domain;

public class PlanStats : Entity
{
    public Guid PlanId { get; private set; }
    public Guid ApiServiceId { get; private set; }
    public decimal MonthlyRevenue { get; private set; }
    public decimal CurrentMonthEarnings { get; private set; }
    public decimal PendingPayouts { get; private set; }
    public int ActiveSubscribers { get; private set; }
    public decimal AverageRevenuePerSubscriber { get; private set; }
    public DateTime LastCalculatedAt { get; private set; }
}
