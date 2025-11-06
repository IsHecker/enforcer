using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices.Events;

public sealed class ApiServiceCreatedEvent(Guid apiServiceId, Guid creatorId) : DomainEvent
{
    public Guid ApiServiceId { get; } = apiServiceId;
    public Guid CreatorId { get; } = creatorId;
}