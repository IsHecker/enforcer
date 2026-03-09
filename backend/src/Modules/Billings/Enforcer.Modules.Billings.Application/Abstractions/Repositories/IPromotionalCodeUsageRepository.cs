using Enforcer.Common.Application.Data;
using Enforcer.Modules.Billings.Domain.PromotionalCodeUsages;

namespace Enforcer.Modules.Billings.Application.Abstractions.Repositories;

public interface IPromotionalCodeUsageRepository : IRepository<PromotionalCodeUsage>
{
    Task<int> GetUserUsageCountAsync(Guid promoCodeId, Guid consumerId, CancellationToken cancellationToken = default);
    Task<int> DeleteAllByPromoCodeIdAsync(Guid promoCodeId, CancellationToken cancellationToken = default);
}