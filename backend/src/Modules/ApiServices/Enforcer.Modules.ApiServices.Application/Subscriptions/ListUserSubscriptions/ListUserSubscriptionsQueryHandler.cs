using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Subscriptions.GetSubscriptionById;
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

        var subscriptionsResponse = await subscriptionRepository.ListByConsumerAsync(request.ConsumerId, cancellationToken);

        return subscriptionsResponse.Select(s => s.ToResponse()).ToResult();
    }
}