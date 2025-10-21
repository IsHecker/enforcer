using Enforcer.Modules.ApiServices.Application.Subscriptions;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.Subscriptions;

internal sealed class SubscriptionRepository(ApiServicesDbContext context) : ISubscriptionRepository
{
    public async Task<Subscription?> GetByIdAsync(Guid subscriptionId, CancellationToken cancellationToken = default)
    {
        return await context.Subscriptions
            .AsNoTracking()
            .Include(sub => sub.Plan)
            .FirstOrDefaultAsync(s =>
                s.Id == subscriptionId
                , cancellationToken);
    }

    public async Task AddAsync(Subscription subscription, CancellationToken cancellationToken = default)
    {
        await context.Subscriptions.AddAsync(subscription, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Subscription subscription, CancellationToken cancellationToken = default)
    {
        context.Subscriptions.Update(subscription);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Subscription subscription, CancellationToken cancellationToken = default)
    {
        context.Subscriptions.Remove(subscription);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<Subscription>> ListByConsumerAsync(Guid consumerId, CancellationToken cancellationToken = default)
    {
        return await context.Subscriptions
            .AsNoTracking()
            .Where(s => s.ConsumerId == consumerId && (!s.ExpiresAt.HasValue || s.ExpiresAt >= DateTime.UtcNow))
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Subscription>> ListByApiServiceAsync(Guid apiServiceId, CancellationToken cancellationToken = default)
    {
        return await context.Subscriptions
            .AsNoTracking()
            .Where(s => s.ApiServiceId == apiServiceId)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsActiveSubscriptionAsync(
        Guid consumerId,
        Guid apiServiceId,
        CancellationToken cancellationToken = default)
    {
        return await context.Subscriptions
            .AsNoTracking()
            .AnyAsync(s => s.ConsumerId == consumerId
                           && s.ApiServiceId == apiServiceId
                           && (!s.ExpiresAt.HasValue || s.ExpiresAt >= DateTime.UtcNow),
                cancellationToken);
    }
}