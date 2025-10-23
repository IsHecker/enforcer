using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.ApiServices.Application.Plans;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.Plans;

public sealed class PlanRepository(ApiServicesDbContext context) : Repository<Plan>(context), IPlanRepository
{
    public async Task<PlanFeature?> GetFeatureByFeatureIdAsync(Guid featureId, CancellationToken cancellationToken = default)
    {
        return await context.PlanFeatures
            .FirstOrDefaultAsync(x => x.Id == featureId, cancellationToken);
    }

    public async Task AddFeatureAsync(PlanFeature feature, CancellationToken cancellationToken = default)
    {
        await context.PlanFeatures.AddAsync(feature, cancellationToken);
    }
}