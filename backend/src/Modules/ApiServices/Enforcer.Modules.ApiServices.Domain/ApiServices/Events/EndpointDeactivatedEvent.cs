using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices.Events;

internal sealed class EndpointDeactivatedEvent(Guid endpointId) : DomainEvent
{
    public Guid EndpointId { get; } = endpointId;
}