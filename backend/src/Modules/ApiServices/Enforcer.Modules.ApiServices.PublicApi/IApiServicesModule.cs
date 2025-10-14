using Enforcer.Modules.ApiServices.Contracts.ApiKeyBlacklist;
using Enforcer.Modules.ApiServices.Contracts.ApiServices;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.ApiServices.Contracts.Usages;

namespace Enforcer.Modules.ApiServices.PublicApi;

public interface IApiServicesApi
{
    Task<ApiServiceResponse?> GetApiServiceByServiceKeyAsync(string serviceKey,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<EndpointResponse>> ListEndpointsForServiceAsync(Guid apiServiceId,
        CancellationToken cancellationToken = default);

    Task<SubscriptionResponse?> GetSubscriptionAsync(string apiKey, string serviceKey, CancellationToken ct = default);

    Task<ApiKeyBlacklistResponse?> GetBlacklistedApiKeyAsync(string apiKey, CancellationToken ct = default);

    Task LiftBanFromApiKeyAsync(string apiKey, CancellationToken ct = default);

    Task<bool> IsSubscribedToRequiredPlanAsync(PlanResponse subscribedPlan, Guid requiredPlanId, CancellationToken ct = default);

    Task<QuotaUsageResponse?> GetQuotaUsageAsync(
        Guid subscriptionId,
        Guid apiServiceId,
        CancellationToken ct = default);
}