using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.PublicApi;

public interface IBillingsApi
{
    Task<Result> ProcessPlanSwitchBillingAsync(
        SubscriptionResponse subscription,
        PlanResponse targetPlan,
        CancellationToken cancellationToken = default);

    Task<Result> ProcessCancellationRefundAsync(
        SubscriptionResponse subscription,
        CancellationToken cancellationToken = default);

    Task<Result<SessionResponse>> CreateSubscriptionCheckoutSessionAsync(
        Guid consumerId,
        Guid creatorId,
        SubscriptionResponse subscription,
        PlanResponse plan,
        string promoCode,
        string returnUrl,
        CancellationToken cancellationToken = default);
}