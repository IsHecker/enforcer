namespace Enforcer.Modules.ApiServices.Application.Abstractions.Services;

public interface ISubscriptionService
{
    Task<Guid> CreateSubscriptionAsync(
        Guid consumerId,
        Guid planId,
        CancellationToken cancellationToken = default);
}