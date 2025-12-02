using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Billings.Domain.PromotionalCodeUsages;
using Enforcer.Modules.Billings.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Infrastructure.PromotionalCodes;

internal sealed class PromotionalCodeUsageRepository(BillingsDbContext context) : Repository<PromotionalCodeUsage>(context)
{
    public Task<int> GetUserUsageCountAsync(Guid promoCodeId, Guid consumerId, CancellationToken cancellationToken)
    {
        return context.PromotionalCodeUsages
            .CountAsync(usages => usages.PromoCodeId == promoCodeId
                && usages.ConsumerId == consumerId, cancellationToken);
    }
}