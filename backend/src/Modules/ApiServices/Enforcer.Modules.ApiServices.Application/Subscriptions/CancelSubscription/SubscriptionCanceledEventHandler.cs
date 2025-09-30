using Enforcer.Common.Application.Abstractions.Data;
using Enforcer.Common.Application.Exceptions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CancelSubscription;

public class SubscriptionCanceledEventHandler(
    IApiServiceRepository apiServiceRepository,
    IUnitOfWork unitOfWork) : DomainEventHandler<SubscriptionCanceledEvent>
{
    public override async Task Handle(SubscriptionCanceledEvent domainEvent, CancellationToken cancellationToken = default)
    {
        var apiService = await apiServiceRepository.GetByIdAsync(domainEvent.ApiServiceId, cancellationToken);
        if (apiService is null)
            throw new EnforcerException("api service is null");

        var result = apiService.DecrementSubscriptions();
        if (result.IsFailure)
            throw new EnforcerException(nameof(ApiService.DecrementSubscriptions), result.Error);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}