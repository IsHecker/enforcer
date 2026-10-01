using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Enforcer.Modules.Billings.Contracts;
using Enforcer.Modules.Billings.PublicApi;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.RenewSubscription;

internal sealed class RenewSubscriptionCommandHandler(
    ISubscriptionRepository subscriptionRepository,
    IApiServiceRepository apiServiceRepository,
    IBillingsApi billingsApi) : ICommandHandler<RenewSubscriptionCommand, PaymentIntentResponse>
{
    public async Task<Result<PaymentIntentResponse>> Handle(RenewSubscriptionCommand request, CancellationToken cancellationToken)
    {
        var subscription = await subscriptionRepository.GetByIdAsync(request.SubscriptionId, cancellationToken);
        if (subscription is null)
            return SubscriptionErrors.NotFound(request.SubscriptionId);

        var apiService = await apiServiceRepository.GetByIdAsync(subscription.ApiServiceId, cancellationToken);

        var billingResult = await billingsApi.ProcessRenewalBillingAsync(
            apiService!.CreatorId,
            subscription.ToResponse(),
            cancellationToken);

        if (billingResult.IsFailure)
            return billingResult.Error;

        var renewResult = subscription.Renew();
        if (renewResult.IsFailure)
            return renewResult.Error;

        subscriptionRepository.Update(subscription);

        return billingResult;
    }
}