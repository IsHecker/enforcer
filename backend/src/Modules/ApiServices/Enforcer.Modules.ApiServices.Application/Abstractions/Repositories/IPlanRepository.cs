using Enforcer.Common.Application.Data;
using Enforcer.Modules.ApiServices.Domain.Plans;

namespace Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;

public interface IPlanRepository : IRepository<Plan>
{
    Task AddFeatureAsync(PlanFeature feature, CancellationToken cancellationToken = default);
    Task<PlanFeature?> GetFeatureByFeatureIdAsync(Guid featureId, CancellationToken cancellationToken = default);
}