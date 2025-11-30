using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Application.ApiKeyBans;
using Enforcer.Modules.ApiServices.Application.ApiServices.GetApiServiceById;
using Enforcer.Modules.ApiServices.Application.Endpoints.GetEndpointById;
using Enforcer.Modules.ApiServices.Application.Endpoints.ListEndpointsForService;
using Enforcer.Modules.ApiServices.Application.Plans;
using Enforcer.Modules.ApiServices.Application.Subscriptions;
using Enforcer.Modules.ApiServices.Application.Subscriptions.GetSubscriptionById;
using Enforcer.Modules.ApiServices.Contracts.ApiKeyBlacklist;
using Enforcer.Modules.ApiServices.Contracts.ApiServices;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.ApiServices.Domain.ApiServices.ValueObjects;
using Enforcer.Modules.ApiServices.Infrastructure.ApiUsages;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Enforcer.Modules.ApiServices.PublicApi;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.ApiServices.Infrastructure.PublicApi;

internal sealed class ApiServicesApi(
    ApiServicesDbContext context,
    IApiServiceRepository serviceRepository,
    ISubscriptionRepository subscriptionRepository,
    ApiUsageEnforcementService enforcementService,
    [FromKeyedServices(nameof(ApiServices))] IUnitOfWork unitOfWork,
    ISender sender) : IApiServicesApi
{
    public async Task<ApiServiceResponse?> GetApiServiceByServiceKeyAsync(
        string serviceKey,
        CancellationToken cancellationToken = default)
    {
        var keyResult = ServiceKey.Create(serviceKey);
        if (keyResult.IsFailure)
            return null;

        var apiService = await serviceRepository.GetByServiceKeyAsync(serviceKey, cancellationToken);
        return apiService?.ToResponse();
    }

    public async Task<IEnumerable<EndpointResponse>> ListEndpointsForServiceAsync(Guid apiServiceId,
        CancellationToken cancellationToken = default)
    {
        var result = await sender.Send(new ListEndpointsForServiceQuery(apiServiceId), cancellationToken);
        if (result.IsFailure)
            return [];

        return result.Value;
    }

    public async Task<SubscriptionResponse?> GetSubscriptionForServiceAsync(
        string apiKey,
        Guid apiServiceId,
        CancellationToken cancellationToken = default)
    {
        return await context.Subscriptions
            .AsNoTracking()
            .Include(s => s.Plan)
            .Where(s => s.ApiKey == apiKey
                        && s.ApiService.Id == apiServiceId)
            .Select(s => s.ToResponse())
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<ApiKeyBanResponse?> GetApiKeyBanAsync(string apiKey, CancellationToken cancellationToken = default)
    {
        return await context.ApiKeyBans
            .AsNoTracking()
            .Where(ban => ban.ApiKey == apiKey)
            .Select(ban => ban.ToResponse())
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task UnbanApiKeyAsync(string apiKey, CancellationToken cancellationToken = default)
    {
        await context.ApiKeyBans
            .AsNoTracking()
            .Where(bl => bl.ApiKey == apiKey)
            .ExecuteDeleteAsync(cancellationToken);
    }

    public async Task<bool> IsSubscribedToRequiredPlanAsync(
        PlanResponse subscribedPlan,
        Guid requiredPlanId,
        CancellationToken cancellationToken = default)
    {
        if (subscribedPlan.Id == requiredPlanId)
            return true;

        return await context.Plans
            .Where(p => p.Id == requiredPlanId && subscribedPlan.TierLevel >= p.TierLevel)
            .AnyAsync(cancellationToken);
    }

    public Task<Result> ConsumeQuotaAsync(Guid subscriptionId, PlanResponse plan)
        => enforcementService.ConsumeQuotaAsync(subscriptionId, plan.ToDomain());

    public async Task<List<SubscriptionResponse>> GetExpiredSubscriptions(
        int size,
        CancellationToken cancellationToken = default)
    {
        return await context.Subscriptions
            .AsNoTracking()
            .Include(sub => sub.Plan)
            .Include(sub => sub.ApiUsage)
            .Where(sub => sub.ExpiresAt.HasValue
                && sub.ExpiresAt <= DateTime.UtcNow && sub.ConsumerId == Guid.Parse("3FA85F64-5717-4562-B3FC-2C963F66AFA6"))
            .Take(size)
            .Select(sub => sub.ToResponse())
            .ToListAsync(cancellationToken);
    }

    public async Task RenewSubscription(Guid subscriptionId, CancellationToken cancellationToken = default)
    {
        var subscription = await context.Subscriptions
            .AsNoTracking()
            .Include(sub => sub.Plan)
            .Include(sub => sub.ApiUsage)
            .FirstAsync(sub => sub.Id == subscriptionId, cancellationToken);

        subscription.Renew();

        var plan = subscription.Plan;

        subscription.ApiUsage.ResetUsage(plan.QuotaLimit, plan.QuotaResetPeriod, true);

        subscriptionRepository.Update(subscription);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<int> DeleteExpiredSubscriptions(int size, CancellationToken cancellationToken = default)
    {
        var expiredIds = await context.Subscriptions
            .AsNoTracking()
            .Where(sub => sub.ExpiresAt.HasValue
                && sub.ExpiresAt <= DateTime.UtcNow
                && sub.IsCanceled == true)
            .Take(size)
            .Select(sub => sub.Id)
            .ToListAsync(cancellationToken);

        if (expiredIds.Count == 0)
            return 0;

        return await context.Subscriptions
            .Where(sub => expiredIds.Contains(sub.Id))
            .ExecuteDeleteAsync(cancellationToken);
    }

    public async Task ActivateSubscription(Guid subscriptionId, CancellationToken cancellationToken = default)
    {
        var subscription = await subscriptionRepository.GetByIdAsync(subscriptionId, cancellationToken);
        subscription!.Activate();
        subscriptionRepository.Update(subscription);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}