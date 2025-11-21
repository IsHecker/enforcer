using Enforcer.Common.Application.EventBus;

namespace Enforcer.Modules.ApiServices.IntegrationEvents.Endpoints;

public class EndpointCreatedIntegrationEvent : IntegrationEvent
{
    public EndpointCreatedIntegrationEvent(
        Guid id,
        DateTime occurredOnUtc,
        Guid endpointId) : base(id, occurredOnUtc)
    {
        EndpointId = endpointId;
    }

    public Guid EndpointId { get; init; }
}