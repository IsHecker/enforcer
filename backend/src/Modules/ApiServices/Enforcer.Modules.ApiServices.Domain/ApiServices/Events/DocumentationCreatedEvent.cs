using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices.Events;

public class DocumentationCreatedEvent(Guid documentationId)
    : DomainEvent
{
    public Guid DocumentationId { get; } = documentationId;
}