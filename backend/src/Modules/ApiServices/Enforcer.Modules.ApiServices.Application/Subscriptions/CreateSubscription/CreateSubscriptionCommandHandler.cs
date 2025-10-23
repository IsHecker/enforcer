using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Plans;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CreateSubscription;

internal sealed class CreateSubscriptionCommandHandler(
    ISubscriptionRepository subscriptionRepository,
    IPlanRepository planRepository) : ICommandHandler<CreateSubscriptionCommand, Guid>
{
    public async Task<Result<Guid>> Handle(CreateSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var isExist = await subscriptionRepository.ExistsAsync(request.ConsumerId, request.ApiServiceId, cancellationToken);
        if (isExist)
            return SubscriptionErrors.AlreadySubscribed;

        var plan = await planRepository.GetByIdAsync(request.PlanId, cancellationToken);
        if (plan is null)
            return PlanErrors.NotFound(request.PlanId);

        var subscriptionResult = Subscription.Create(request.ConsumerId, plan);

        if (subscriptionResult.IsFailure)
            return subscriptionResult.Error;

        var subscription = subscriptionResult.Value;

        await subscriptionRepository.AddAsync(subscription, cancellationToken);

        return subscription.Id;
    }
}