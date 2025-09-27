using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices.Events;

public class ApiServiceUpdatedEvent(Guid apiServiceId) : DomainEvent
{
    public Guid ApiServiceId { get; } = apiServiceId;
}