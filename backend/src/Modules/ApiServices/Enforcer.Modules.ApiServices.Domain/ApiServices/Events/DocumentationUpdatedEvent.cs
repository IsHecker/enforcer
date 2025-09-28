using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices.Events;

public class DocumentationUpdatedEvent(Guid documentationId)
    : DomainEvent
{
    public Guid DocumentationId { get; } = documentationId;
}
