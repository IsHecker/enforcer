using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.Subscriptions;

internal sealed class SubscriptionRepository(ApiServicesDbContext context)
    : Repository<Subscription>(context), ISubscriptionRepository
{
    public override Task<Subscription?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return context.Subscriptions
            .AsNoTracking()
            .Include(sub => sub.Plan)
            .FirstOrDefaultAsync(entity => entity.Id == id, ct);
    }
    public async Task<List<Subscription>> ListByConsumerAsync(Guid consumerId, CancellationToken cancellationToken = default)
    {
        return await context.Subscriptions
            .AsNoTracking()
            .Where(sub => sub.ConsumerId == consumerId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Subscription>> ListByApiServiceAsync(Guid apiServiceId, CancellationToken cancellationToken = default)
    {
        return await context.Subscriptions
            .AsNoTracking()
            .Where(sub => sub.ApiServiceId == apiServiceId)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(
        Guid consumerId,
        Guid apiServiceId,
        CancellationToken cancellationToken = default)
    {
        return await context.Subscriptions
            .AsNoTracking()
            .AnyAsync(sub => sub.ConsumerId == consumerId
                           && sub.ApiServiceId == apiServiceId,
                cancellationToken);
    }

    public Task<bool> ExistsByApiKeyAsync(string apiKey, CancellationToken ct = default)
    {
        return context.Subscriptions.AnyAsync(sub => sub.ApiKey == apiKey, ct);
    }
}