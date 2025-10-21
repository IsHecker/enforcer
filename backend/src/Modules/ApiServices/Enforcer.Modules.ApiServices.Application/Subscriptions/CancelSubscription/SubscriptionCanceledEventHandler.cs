using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Exceptions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CancelSubscription;

internal sealed class SubscriptionCanceledEventHandler(
    IApiServiceRepository apiServiceRepository,
    IUnitOfWork unitOfWork) : IDomainEventHandler<SubscriptionCanceledEvent>
{
    public async Task Handle(SubscriptionCanceledEvent domainEvent, CancellationToken cancellationToken = default)
    {
        var apiService = await apiServiceRepository.GetByIdAsync(domainEvent.ApiServiceId, cancellationToken);
        if (apiService is null)
            throw new EnforcerException("api service is null");

        apiService.DecrementSubscriptions();

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}