using System.Net;
using Enforcer.Common.Application.EventBus;

namespace Enforcer.Modules.Gateway.IntegrationEvents;

public sealed class RequestForwardedIntegrationEvent : IntegrationEvent
{
    public RequestForwardedIntegrationEvent(
        Guid id,
        DateTime occurredOnUtc,
        Guid apiServiceId,
        Guid endpointId,
        Guid subscriptionId,
        HttpStatusCode statusCode,
        float responseTimeMs) : base(id, occurredOnUtc)
    {
        ApiServiceId = apiServiceId;
        StatusCode = statusCode;
        ResponseTimeMs = responseTimeMs;
        EndpointId = endpointId;
        SubscriptionId = subscriptionId;
    }

    public Guid ApiServiceId { get; init; }
    public Guid EndpointId { get; init; }
    public Guid SubscriptionId { get; init; }
    public HttpStatusCode StatusCode { get; init; }
    public float ResponseTimeMs { get; init; }
}