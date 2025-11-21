using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Analytics.Contracts;

namespace Enforcer.Modules.Analytics.Application.SubscriptionStats.GetSubscriptionStat;

public sealed class GetSubscriptionStatQueryHandler(ISubscriptionStatRepository subscriptionStatRepository)
    : IQueryHandler<GetSubscriptionStatQuery, SubscriptionStatResponse>
{
    public async Task<Result<SubscriptionStatResponse>> Handle(
        GetSubscriptionStatQuery request,
        CancellationToken cancellationToken)
    {
        var subscriptionStat = await subscriptionStatRepository.GetBySubscriptionIdAsync(
            request.SubscriptionId,
            cancellationToken);

        if (subscriptionStat is null)
            return Error.NotFound(
                "SubscriptionStat.NotFound",
                $"Subscription stat for Subscription with ID '{request.SubscriptionId}' was not found.");

        return subscriptionStat.ToResponse();
    }
}