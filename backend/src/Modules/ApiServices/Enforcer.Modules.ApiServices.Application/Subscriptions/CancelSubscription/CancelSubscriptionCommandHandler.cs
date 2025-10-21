using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CancelSubscription;

internal sealed class CancelSubscriptionCommandHandler(
    ISubscriptionRepository subscriptionRepository) : ICommandHandler<CancelSubscriptionCommand>
{
    public async Task<Result> Handle(CancelSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var subscription = await subscriptionRepository.GetByIdAsync(request.SubscriptionId, cancellationToken);

        if (subscription is null)
            return SubscriptionErrors.NotFound(request.SubscriptionId);

        if (subscription.ConsumerId != request.ConsumerId)
            return SubscriptionErrors.Unauthorized;

        var cancelResult = subscription.Cancel();
        if (cancelResult.IsFailure)
            return cancelResult.Error;

        await subscriptionRepository.UpdateAsync(subscription, cancellationToken);

        return Result.Success;
    }
}