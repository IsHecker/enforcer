using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.ApiKeyBlacklist;
using Enforcer.Modules.ApiServices.Contracts.ApiServices;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;

namespace Enforcer.Modules.ApiServices.PublicApi;

public interface IApiServicesApi
{
    Task<ApiServiceResponse?> GetApiServiceByServiceKeyAsync(string serviceKey,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<EndpointResponse>> ListEndpointsForServiceAsync(Guid apiServiceId,
        CancellationToken cancellationToken = default);

    Task<SubscriptionResponse?> GetSubscriptionForServiceAsync(string apiKey, Guid apiServiceId, CancellationToken ct = default);

    Task<PlanResponse?> GetPlanByIdAsync(Guid planId, CancellationToken ct = default);

    Task<ApiKeyBanResponse?> GetApiKeyBanAsync(string apiKey, CancellationToken ct = default);

    Task UnbanApiKeyAsync(string apiKey, CancellationToken ct = default);

    Task<bool> IsSubscribedToRequiredPlanAsync(PlanResponse subscribedPlan, Guid requiredPlanId, CancellationToken ct = default);

    Task<Result> ConsumeQuotaAsync(Guid subscriptionId, PlanResponse plan);

    Task<List<SubscriptionResponse>> GetExpiredSubscriptions(int size, CancellationToken ct = default);

    Task RenewSubscription(Guid subscriptionId, CancellationToken ct = default);
    Task<int> DeleteExpiredSubscriptions(int size, CancellationToken ct = default);
}