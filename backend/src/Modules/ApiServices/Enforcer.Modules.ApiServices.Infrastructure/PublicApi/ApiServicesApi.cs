using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Application.ApiKeyBans;
using Enforcer.Modules.ApiServices.Application.ApiServices.GetApiServiceById;
using Enforcer.Modules.ApiServices.Application.Endpoints.GetEndpointById;
using Enforcer.Modules.ApiServices.Application.Endpoints.ListEndpointsForService;
using Enforcer.Modules.ApiServices.Application.QuotaUsages;
using Enforcer.Modules.ApiServices.Application.Subscriptions;
using Enforcer.Modules.ApiServices.Contracts.ApiKeyBlacklist;
using Enforcer.Modules.ApiServices.Contracts.ApiServices;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.ApiServices.Contracts.Usages;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.ApiServices.ValueObjects;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Enforcer.Modules.ApiServices.PublicApi;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.PublicApi;

internal class ApiServicesApi(
    ApiServicesDbContext context,
    IApiServiceRepository serviceRepository,
    QuotaEnforcementService enforcementService,
    ISender sender) : IApiServicesApi
{
    public async Task<ApiServiceResponse?> GetApiServiceByServiceKeyAsync(
        string serviceKey,
        CancellationToken ct = default)
    {
        var keyResult = ServiceKey.Create(serviceKey);
        if (keyResult.IsFailure)
            return null;

        var apiService = await serviceRepository.GetByServiceKeyAsync(serviceKey, ct);
        return apiService?.ToResponse();
    }

    public async Task<IEnumerable<EndpointResponse>> ListEndpointsForServiceAsync(Guid apiServiceId,
        CancellationToken ct = default)
    {
        var result = await sender.Send(new ListEndpointsForServiceQuery(apiServiceId), ct);
        if (result.IsFailure)
            return [];

        return result.Value;
    }

    public async Task<SubscriptionResponse?> GetSubscriptionForServiceAsync(
        string apiKey,
        string serviceKey,
        CancellationToken ct = default)
    {
        return await context.Subscriptions
            .AsNoTracking()
            .Include(s => s.Plan)
            .Where(s => s.ApiKey == apiKey
                        && s.ApiService.ServiceKey == serviceKey)
            .Select(s => s.ToResponse())
            .FirstOrDefaultAsync(ct);
    }

    public async Task<ApiKeyBanResponse?> GetApiKeyBanAsync(string apiKey, CancellationToken ct = default)
    {
        return await context.ApiKeyBans
            .AsNoTracking()
            .Where(ban => ban.ApiKey == apiKey)
            .Select(ban => ban.ToResponse())
            .FirstOrDefaultAsync(ct);
    }

    public async Task UnbanApiKeyAsync(string apiKey, CancellationToken ct = default)
    {
        await context.ApiKeyBans
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
            .Where(qu => qu.SubscriptionId == subscriptionId)
            .Select(qu => qu.ToResponse())
            .FirstOrDefaultAsync(ct);
    }

    public Task<Result> ConsumeQuotaAsync(Guid subscriptionId, int quotaLimit, string resetPeriod)
        => enforcementService.ConsumeQuotaAsync(
            subscriptionId,
            quotaLimit,
            resetPeriod);
}