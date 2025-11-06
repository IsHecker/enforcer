using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Usages.Events;

public sealed class ApiKeyBannedEvent(Guid banId) : DomainEvent
{
    public Guid BanId { get; } = banId;
}