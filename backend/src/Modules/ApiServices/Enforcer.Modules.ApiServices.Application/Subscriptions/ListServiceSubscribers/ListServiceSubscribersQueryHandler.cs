using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Application.Subscriptions.GetSubscriptionById;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.ListServiceSubscribers;

internal sealed class ListServiceSubscribersQueryHandler(
    ISubscriptionRepository subscriptionRepository,
    IApiServiceRepository serviceRepository) : IQueryHandler<ListServiceSubscribersQuery, IEnumerable<SubscriptionResponse>>
{
    public async Task<Result<IEnumerable<SubscriptionResponse>>> Handle(ListServiceSubscribersQuery request,
        CancellationToken cancellationToken)
    {
        if (request.ApiServiceId == Guid.Empty)
            return Error.Validation(description: "Api service Id can't be empty.");

        if (await serviceRepository.ExistsAsync(request.ApiServiceId, cancellationToken))
            return ApiServiceErrors.NotFound(request.ApiServiceId);

        var subscriptions = await subscriptionRepository.ListByApiServiceAsync(request.ApiServiceId, cancellationToken);

        return subscriptions.Select(s => s.ToResponse()).ToResult();
    }
}