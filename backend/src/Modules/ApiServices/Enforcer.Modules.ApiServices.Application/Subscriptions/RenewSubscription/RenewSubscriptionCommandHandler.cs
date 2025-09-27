using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.RenewSubscription;

public class RenewSubscriptionCommandHandler(ISubscriptionRepository subscriptionRepository) : ICommandHandler<RenewSubscriptionCommand>
{
    public async Task<Result> Handle(RenewSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var subscriptionResult = await subscriptionRepository.GetByIdAsync(request.SubscriptionId, cancellationToken);
        if (subscriptionResult is null)
            return SubscriptionErrors.NotFound(request.SubscriptionId);

        var renewResult = subscriptionResult.Renew();
        if (renewResult.IsFailure)
            return renewResult;

        await subscriptionRepository.UpdateAsync(subscriptionResult, cancellationToken);

        return Result.Success;
    }
}