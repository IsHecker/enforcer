using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Usages.Events;

internal sealed class ApiKeyBanLiftedEvent(Guid blacklistId, string apiKey, DateTime liftedAt) : DomainEvent
{
    public Guid BlacklistId { get; } = blacklistId;
    public string ApiKey { get; } = apiKey;
    public DateTime LiftedAt { get; } = liftedAt;
}