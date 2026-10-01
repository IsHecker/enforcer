using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.PublicApi;

public interface IBillingsApi
{
    Task<Result<PaymentIntentResponse>> ProcessPlanSwitchBillingAsync(
        Guid creatorId,
        SubscriptionResponse subscription,
        PlanResponse targetPlan,
        CancellationToken cancellationToken = default);

    Task<Result> ProcessCancellationRefundAsync(
        SubscriptionResponse subscription,
        CancellationToken cancellationToken = default);

    Task<Result<PaymentIntentResponse>> ProcessRenewalBillingAsync(
        Guid creatorId,
        SubscriptionResponse subscription,
        CancellationToken cancellationToken = default);

    Task<Result<PaymentIntentResponse>> InitializePaymentAsync(
        Guid consumerId,
        Guid creatorId,
        DateTime? subscriptionExpiresAt,
        PlanResponse plan,
        string promoCode,
        CancellationToken cancellationToken = default);
}