using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices.Events;

public class ApiServiceDeprecatedEvent(Guid apiServiceId) : DomainEvent
{
    public Guid ApiServiceId { get; init; } = apiServiceId;
}