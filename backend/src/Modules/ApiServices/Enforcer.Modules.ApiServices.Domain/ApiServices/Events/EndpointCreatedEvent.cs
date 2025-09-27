using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices;

public class EndpointCreatedEvent(Guid endpointId, Guid apiServiceId) : DomainEvent
{
    public Guid EndpointId { get; } = endpointId;
    public Guid ApiServiceId { get; } = apiServiceId;
}
