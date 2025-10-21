using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices.Events;

internal sealed class DocumentationCreatedEvent(Guid documentationId) : DomainEvent
{
    public Guid DocumentationId { get; } = documentationId;
}