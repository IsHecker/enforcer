using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Analytics.Domain;

public class DailyApiServiceUsage : Entity
{
    public Guid ApiServiceId { get; private set; }
    public DateTime Date { get; private set; }
    public long TotalApiCalls { get; private set; }
    public int UniqueConsumers { get; private set; }
    public decimal Revenue { get; private set; }
}
