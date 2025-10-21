using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Enums.ApiServices;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices.Events;

internal sealed class EndpointRateLimitChangedEvent(Guid endpointId, int? newRateLimit, RateLimitWindow? newWindow) : DomainEvent
{
    public Guid EndpointId { get; } = endpointId;
    public int? NewRateLimit { get; } = newRateLimit;
    public RateLimitWindow? NewWindow { get; } = newWindow;
}