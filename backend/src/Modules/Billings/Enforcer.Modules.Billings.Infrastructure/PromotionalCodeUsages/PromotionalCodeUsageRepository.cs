using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.PromotionalCodeUsages;
using Enforcer.Modules.Billings.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Infrastructure.PromotionalCodeUsages;

internal sealed class PromotionalCodeUsageRepository(BillingsDbContext context)
    : Repository<PromotionalCodeUsage>(context), IPromotionalCodeUsageRepository
{
    public Task<int> DeleteAllByPromoCodeIdAsync(Guid promoCodeId, CancellationToken cancellationToken = default)
    {
        return context.PromotionalCodeUsages
            .Where(usage => usage.PromoCodeId == promoCodeId)
            .ExecuteDeleteAsync(cancellationToken);
    }

    public Task<int> GetUserUsageCountAsync(Guid promoCodeId, Guid consumerId, CancellationToken cancellationToken = default)
    {
        return context.PromotionalCodeUsages
            .CountAsync(usages => usages.PromoCodeId == promoCodeId
                && usages.ConsumerId == consumerId, cancellationToken);
    }
}