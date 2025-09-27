using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Usages.Events;

public class QuotaUsageCreatedEvent(Guid quotaUsageId, Guid subscriptionId, int quotasLeft, DateTime resetAt) : DomainEvent
{
    public Guid QuotaUsageId { get; } = quotaUsageId;
    public Guid SubscriptionId { get; } = subscriptionId;
    public int QuotasLeft { get; } = quotasLeft;
    public DateTime ResetAt { get; } = resetAt;
}
