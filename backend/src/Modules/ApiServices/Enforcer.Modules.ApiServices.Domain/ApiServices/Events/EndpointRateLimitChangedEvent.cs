using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices;

public class EndpointRateLimitChangedEvent(Guid endpointId, int? newRateLimit, RateLimitWindows? newWindow) : DomainEvent
{
    public Guid EndpointId { get; } = endpointId;
    public int? NewRateLimit { get; } = newRateLimit;
    public RateLimitWindows? NewWindow { get; } = newWindow;
}
