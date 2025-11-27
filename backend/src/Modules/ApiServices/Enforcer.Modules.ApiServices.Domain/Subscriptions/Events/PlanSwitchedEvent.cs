using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

public sealed class PlanSwitchedEvent(
    Guid subscriptionId,
    Guid oldPlanId,
    Guid newPlanId,
    DateTime subscribedAt,
    DateTime? oldExpirationDate) : DomainEvent
{
    public Guid SubscriptionId { get; } = subscriptionId;
    public Guid OldPlanId { get; } = oldPlanId;
    public Guid NewPlanId { get; } = newPlanId;
    public DateTime? SubscribedAt { get; } = subscribedAt;
    public DateTime? OldExpirationDate { get; } = oldExpirationDate;
}