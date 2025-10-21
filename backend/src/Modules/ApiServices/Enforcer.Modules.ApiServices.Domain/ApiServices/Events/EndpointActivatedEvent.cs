using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices.Events;

internal sealed class EndpointActivatedEvent(Guid endpointId) : DomainEvent
{
    public Guid EndpointId { get; } = endpointId;
}