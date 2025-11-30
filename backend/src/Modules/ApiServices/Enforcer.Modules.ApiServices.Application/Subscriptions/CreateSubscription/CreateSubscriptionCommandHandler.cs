using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Application.Plans;
using Enforcer.Modules.ApiServices.Domain.Plans;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Enforcer.Modules.Billings.PublicApi;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CreateSubscription;

internal sealed class CreateSubscriptionCommandHandler(
    ISubscriptionRepository subscriptionRepository,
    IPlanRepository planRepository,
    IBillingsApi billingsApi) : ICommandHandler<CreateSubscriptionCommand, string>
{
    public async Task<Result<string>> Handle(CreateSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var isExist = await subscriptionRepository.ExistsAsync(request.ConsumerId, request.ApiServiceId, cancellationToken);
        if (isExist)
            return SubscriptionErrors.AlreadySubscribed;

        var plan = await planRepository.GetByIdAsync(request.PlanId, cancellationToken);
        if (plan is null)
            return PlanErrors.NotFound(request.PlanId);

        if (plan.ApiServiceId != request.ApiServiceId)
            return SubscriptionErrors.PlanDoesNotBelongToService;

        var subscriptionResult = Subscription.Create(request.ConsumerId, plan);

        if (subscriptionResult.IsFailure)
            return subscriptionResult.Error;

        var subscription = subscriptionResult.Value;

        await subscriptionRepository.AddAsync(subscription, cancellationToken);

        var checkoutUrl = await billingsApi.CreateSubscriptionCheckoutSessionAsync(
            request.ConsumerId,
            subscription.ToResponse(),
            plan.ToResponse(),
            request.ReturnUrl,
            cancellationToken);

        return checkoutUrl;
    }
}