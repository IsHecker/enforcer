using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices;

public class EndpointRouteChangedEvent(Guid endpointId, string newPublicPath, string newTargetPath) : DomainEvent
{
    public Guid EndpointId { get; } = endpointId;
    public string NewPublicPath { get; } = newPublicPath;
    public string NewTargetPath { get; } = newTargetPath;
}