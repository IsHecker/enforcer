using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.ListUserSubscriptions;

internal sealed class ListUserSubscriptionsQueryHandler(ISubscriptionRepository subscriptionRepository) :
    IQueryHandler<ListUserSubscriptionsQuery, IEnumerable<SubscriptionResponse>>
{
    public async Task<Result<IEnumerable<SubscriptionResponse>>> Handle(ListUserSubscriptionsQuery request,
        CancellationToken cancellationToken)
    {
        if (request.ConsumerId == Guid.Empty)
            return SubscriptionErrors.InvalidConsumerId;

        var subscriptions = await subscriptionRepository.ListByConsumerAsync(request.ConsumerId, cancellationToken);

        return subscriptions.Select(s => s.ToResponse()).ToResult();
    }
}