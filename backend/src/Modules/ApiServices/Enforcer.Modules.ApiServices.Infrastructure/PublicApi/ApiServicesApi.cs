using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Application.ApiKeyBlacklists;
using Enforcer.Modules.ApiServices.Application.ApiServices.GetApiServiceById;
using Enforcer.Modules.ApiServices.Application.QuotaUsages;
using Enforcer.Modules.ApiServices.Application.Subscriptions.GetSubscriptionById;
using Enforcer.Modules.ApiServices.Contracts.ApiKeyBlacklist;
using Enforcer.Modules.ApiServices.Contracts.ApiServices;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.ApiServices.Contracts.Usages;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Enforcer.Modules.ApiServices.PublicApi;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.PublicApi;

public class ApiServicesApi(ApiServicesDbContext context, IApiServiceRepository serviceRepository) : IApiServicesApi
{
    public async Task<ApiServiceResponse?> GetApiServiceByServiceKeyAsync(
        string serviceKey,
        CancellationToken ct = default)
    {
        var apiService = await serviceRepository.GetByServiceKeyAsync(serviceKey, ct);
        return apiService?.ToResponse();
    }

    public async Task<IEnumerable<EndpointResponse>> ListEndpointsForServiceAsync(Guid apiServiceId,
        CancellationToken ct = default)
    {
        return await context.Endpoints
            .AsNoTracking()
            .Where(e => e.ApiServiceId == apiServiceId)
            .Select(e => new EndpointResponse(
                e.Id,
                e.ApiServiceId,
                e.PlanId,
                e.HTTPMethod.ToString(),
                e.PublicPath,
                e.TargetPath,
                e.RateLimit,
                e.RateLimitWindow.ToString(),
                e.IsActive
            ))
            .ToListAsync(ct);
    }

    public async Task<SubscriptionResponse?> GetSubscriptionAsync(
        string apiKey,
        string serviceKey,
        CancellationToken ct = default)
    {
        return await context.Subscriptions
            .AsNoTracking()
            .Include(s => s.Plan)
            .Where(s => s.ApiKey == apiKey && s.ApiService.ServiceKey == serviceKey)
            .Select(s => s.ToResponse())
            .FirstOrDefaultAsync(ct);
    }

    public async Task<ApiKeyBlacklistResponse?> GetBlacklistedApiKeyAsync(
        string apiKey,
        CancellationToken ct = default)
    {
        return await context.ApiKeyBlacklist
            .AsNoTracking()
            .Where(bl => bl.ApiKey == apiKey)
            .Select(bl => bl.ToResponse())
            .FirstOrDefaultAsync(ct);
    }

    public async Task LiftBanFromApiKeyAsync(string apiKey, CancellationToken ct = default)
    {
        await context.ApiKeyBlacklist
            .AsNoTracking()
            .Where(bl => bl.ApiKey == apiKey)
            .ExecuteDeleteAsync(ct);
    }

    public async Task<bool> IsSubscribedToRequiredPlanAsync(
        PlanResponse subscribedPlan,
        Guid requiredPlanId,
        CancellationToken ct = default)
    {
        if (subscribedPlan.PlanId == requiredPlanId)
            return true;

        return await context.Plans
            .Where(p => p.Id == requiredPlanId && subscribedPlan.TierLevel >= p.TierLevel)
            .AnyAsync(ct);
    }

    public async Task<QuotaUsageResponse?> GetQuotaUsageAsync(
        Guid subscriptionId,
        Guid apiServiceId,
        CancellationToken ct = default)
    {
        return await context.QuotaUsages
            .AsNoTracking()
            .Where(qu => qu.SubscriptionId == subscriptionId && qu.ApiServiceId == apiServiceId)
            .Select(qu => qu.ToResponse())
            .FirstOrDefaultAsync(ct);
    }
}