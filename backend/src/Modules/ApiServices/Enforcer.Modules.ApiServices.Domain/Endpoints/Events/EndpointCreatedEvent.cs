using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.Endpoints.Events;

public sealed class EndpointCreatedEvent(Guid endpointId, Guid apiServiceId) : DomainEvent
{
    public Guid EndpointId { get; } = endpointId;
    public Guid ApiServiceId { get; } = apiServiceId;
}