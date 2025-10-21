using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.IsUserSubscribedToService;

internal sealed class IsUserSubscribedToServiceQueryHandler(ISubscriptionRepository subscriptionRepository)
    : IQueryHandler<IsUserSubscribedToServiceQuery, bool>
{
    public async Task<Result<bool>> Handle(IsUserSubscribedToServiceQuery request, CancellationToken cancellationToken)
    {
        if (request.ConsumerId == Guid.Empty)
            return SubscriptionErrors.InvalidConsumerId;

        if (request.ApiServiceId == Guid.Empty)
            return ApiServiceErrors.NotFound(request.ApiServiceId);

        var existsActive = await subscriptionRepository.ExistsActiveSubscriptionAsync(
            request.ConsumerId,
            request.ApiServiceId,
            cancellationToken);

        return existsActive;
    }
}