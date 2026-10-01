using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Application.Abstractions.Services;
using Enforcer.Modules.ApiServices.Application.Plans;
using Enforcer.Modules.ApiServices.Domain.Plans;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Enforcer.Modules.Billings.Contracts;
using Enforcer.Modules.Billings.PublicApi;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CreateSubscription;

internal sealed class CreateSubscriptionCommandHandler(
    ISubscriptionRepository subscriptionRepository,
    ISubscriptionService subscriptionService,
    IPlanRepository planRepository,
    IApiServiceRepository apiServiceRepository,
    IBillingsApi billingsApi) : ICommandHandler<CreateSubscriptionCommand, PaymentIntentResponse>
{
    public async Task<Result<PaymentIntentResponse>> Handle(CreateSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var isExist = await subscriptionRepository.ExistsAsync(request.ConsumerId, request.ApiServiceId, cancellationToken);
        if (isExist)
            return SubscriptionErrors.AlreadySubscribed;

        var plan = await planRepository.GetByIdAsync(request.PlanId, cancellationToken);
        if (plan is null)
            return PlanErrors.NotFound(request.PlanId);

        if (plan.ApiServiceId != request.ApiServiceId)
            return SubscriptionErrors.PlanDoesNotBelongToService;

        var apiService = await apiServiceRepository.GetByIdAsync(plan.ApiServiceId, cancellationToken);

        var subscriptionResult = Subscription.Create(request.ConsumerId, plan);

        if (subscriptionResult.IsFailure)
            return subscriptionResult.Error;

        var createIntentResult = await billingsApi.InitializePaymentAsync(
            request.ConsumerId,
            apiService!.CreatorId,
            subscriptionResult.Value.ExpiresAt,
            plan.ToResponse(),
            request.PromoCode,
            cancellationToken);

        if (createIntentResult.IsFailure)
            return createIntentResult.Error;

        if (createIntentResult.Value.ClientSecret is null)
            await subscriptionService.CreateSubscriptionAsync(request.ConsumerId, request.PlanId, cancellationToken);

        return createIntentResult;
    }
}