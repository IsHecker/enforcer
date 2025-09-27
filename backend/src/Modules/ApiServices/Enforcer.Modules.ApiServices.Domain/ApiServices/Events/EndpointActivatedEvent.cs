using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices;

public class EndpointActivatedEvent(Guid endpointId) : DomainEvent
{
    public Guid EndpointId { get; } = endpointId;
}
