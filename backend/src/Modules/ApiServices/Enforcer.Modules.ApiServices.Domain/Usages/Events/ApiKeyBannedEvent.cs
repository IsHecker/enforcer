using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Usages.Events;

internal sealed class ApiKeyBannedEvent(
    Guid blacklistId,
    string apiKey,
    string reason,
    DateTime bannedAt,
    DateTime? duration,
    Guid bannedBy) : DomainEvent
{
    public Guid BlacklistId { get; } = blacklistId;
    public string ApiKey { get; } = apiKey;
    public string Reason { get; } = reason;
    public DateTime BannedAt { get; } = bannedAt;
    public DateTime? Duration { get; } = duration;
    public Guid BannedBy { get; } = bannedBy;
}