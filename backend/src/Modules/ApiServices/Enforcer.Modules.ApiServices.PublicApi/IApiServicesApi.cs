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

    Task<ApiKeyBanResponse?> GetApiKeyBanAsync(string apiKey, CancellationToken cancellationToken = default);

    Task UnbanApiKeyAsync(string apiKey, CancellationToken cancellationToken = default);

    Task<Result> ConsumeQuotaAsync(Guid subscriptionId, PlanResponse plan);

    Task<SubscriptionResponse?> GetSubscriptionForServiceAsync(
        string apiKey,
        Guid apiServiceId,
        CancellationToken cancellationToken = default);

    Task<bool> IsSubscribedToRequiredPlanAsync(
        PlanResponse subscribedPlan,
        Guid requiredPlanId,
        CancellationToken cancellationToken = default);

    Task<List<SubscriptionResponse>> GetExpiredSubscriptions(int size, CancellationToken cancellationToken = default);

    Task RenewSubscription(Guid subscriptionId, CancellationToken cancellationToken = default);
    Task ActivateSubscription(Guid subscriptionId, CancellationToken cancellationToken = default);
    Task<int> DeleteExpiredSubscriptions(int size, CancellationToken cancellationToken = default);
}