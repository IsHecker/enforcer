using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Plans;

public interface IPlanRepository
{
    Task AddAsync(Plan plan, CancellationToken cancellationToken = default);
    Task<Plan?> GetByIdAsync(Guid planId, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid planId, CancellationToken cancellationToken = default);
    Task UpdateAsync(Plan plan, CancellationToken cancellationToken = default);
    Task DeleteAsync(Plan plan, CancellationToken cancellationToken = default);


    Task AddFeatureAsync(PlanFeature feature, CancellationToken cancellationToken = default);
    Task<PlanFeature?> GetFeatureByFeatureIdAsync(Guid featureId, CancellationToken cancellationToken = default);
}