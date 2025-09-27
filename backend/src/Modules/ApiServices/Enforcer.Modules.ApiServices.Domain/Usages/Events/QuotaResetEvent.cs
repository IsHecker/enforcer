using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Usages.Events;

public class QuotaResetEvent(Guid quotaUsageId, Guid subscriptionId, int newQuota, DateTime resetAt) : DomainEvent
{
    public Guid QuotaUsageId { get; } = quotaUsageId;
    public Guid SubscriptionId { get; } = subscriptionId;
    public int NewQuota { get; } = newQuota;
    public DateTime ResetAt { get; } = resetAt;
}
