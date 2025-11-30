using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;

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

    Task<string> CreateSubscriptionCheckoutSessionAsync(
        Guid consumerId,
        SubscriptionResponse subscription,
        PlanResponse plan,
        string returnUrl,
        CancellationToken cancellationToken = default);
}