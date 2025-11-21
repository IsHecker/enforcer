using Enforcer.Common.Application.EventBus;

namespace Enforcer.Modules.ApiServices.IntegrationEvents.ApiServices;

public sealed class ApiServiceCreatedIntegrationEvent : IntegrationEvent
{
    public ApiServiceCreatedIntegrationEvent(
        Guid id,
        DateTime occurredOnUtc,
        Guid apiServiceId,
        Guid creatorId) : base(id, occurredOnUtc)
    {
        ApiServiceId = apiServiceId;
        CreatorId = creatorId;
    }

    public Guid ApiServiceId { get; init; }
    public Guid CreatorId { get; init; }
}