using Enforcer.Modules.ApiServices.Application.Plans;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.Plans;

public sealed class PlanRepository(ApiServicesDbContext context) : IPlanRepository
{
    public async Task<Plan?> GetByIdAsync(Guid planId, CancellationToken cancellationToken = default)
    {
        return await context.Plans
            .FirstOrDefaultAsync(x => x.Id == planId, cancellationToken);
    }

    public async Task AddAsync(Plan plan, CancellationToken cancellationToken = default)
    {
        await context.Plans.AddAsync(plan, cancellationToken);
    }

    public Task UpdateAsync(Plan plan, CancellationToken cancellationToken = default)
    {
        context.Plans.Update(plan);
        return Task.CompletedTask;
    }

    public async Task<bool> ExistsAsync(Guid planId, CancellationToken cancellationToken = default)
    {
        return await context.Plans
            .AnyAsync(x => x.Id == planId, cancellationToken);
    }


    public async Task<PlanFeature?> GetFeatureByFeatureIdAsync(Guid featureId, CancellationToken cancellationToken = default)
    {
        return await context.PlanFeatures
            .FirstOrDefaultAsync(x => x.Id == featureId, cancellationToken);
    }

    public async Task AddFeatureAsync(PlanFeature feature, CancellationToken cancellationToken = default)
    {
        await context.PlanFeatures.AddAsync(feature, cancellationToken);
    }

    public async Task<int> DeleteAsync(Guid planId, CancellationToken cancellationToken = default)
    {
        return await context.Plans.Where(p => p.Id == planId).ExecuteDeleteAsync(cancellationToken);
    }
}