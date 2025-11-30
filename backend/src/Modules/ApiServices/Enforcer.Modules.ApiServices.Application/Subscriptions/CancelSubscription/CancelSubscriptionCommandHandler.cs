using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Enforcer.Modules.Billings.PublicApi;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CancelSubscription;

internal sealed class CancelSubscriptionCommandHandler(
    ISubscriptionRepository subscriptionRepository,
    IBillingsApi billingsApi) : ICommandHandler<CancelSubscriptionCommand>
{
    public async Task<Result> Handle(CancelSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var subscription = await subscriptionRepository.GetByIdAsync(request.SubscriptionId, cancellationToken);
        if (subscription is null)
            return SubscriptionErrors.NotFound(request.SubscriptionId);

        if (subscription.ConsumerId != request.ConsumerId)
            return SubscriptionErrors.Unauthorized;

        if (request.IsImmediate)
        {
            var refundResult = await billingsApi.ProcessCancellationRefundAsync(subscription.ToResponse(), cancellationToken);

            if (refundResult.IsFailure)
                return refundResult.Error;
        }

        var cancelResult = subscription.Cancel(request.IsImmediate);
        if (cancelResult.IsFailure)
            return cancelResult.Error;

        if (request.IsImmediate)
        {
            subscriptionRepository.Delete(subscription);
        }
        else
        {
            subscriptionRepository.Update(subscription);
        }

        return Result.Success;
    }
}