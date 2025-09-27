using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Usages.Events;

public class QuotaConsumedEvent(Guid quotaUsageId, Guid subscriptionId, int amount, int quotasLeft) : DomainEvent
{
    public Guid QuotaUsageId { get; } = quotaUsageId;
    public Guid SubscriptionId { get; } = subscriptionId;
    public int Amount { get; } = amount;
    public int QuotasLeft { get; } = quotasLeft;
}
