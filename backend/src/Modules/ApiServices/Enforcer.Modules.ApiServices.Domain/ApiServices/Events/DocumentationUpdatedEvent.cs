using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices.Events;

public class DocumentationUpdatedEvent(Guid documentationId, Guid apiServiceId)
    : DomainEvent
{
    public Guid DocumentationId { get; } = documentationId;
    public Guid ApiServiceId { get; } = apiServiceId;
}
