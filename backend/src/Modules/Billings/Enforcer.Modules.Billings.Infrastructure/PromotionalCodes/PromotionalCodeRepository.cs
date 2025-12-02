using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Billings.Domain.PromotionalCodes;
using Enforcer.Modules.Billings.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Infrastructure.PromotionalCodes;

internal sealed class PromotionalCodeRepository(BillingsDbContext context) : Repository<PromotionalCode>(context)
{
    public Task<PromotionalCode?> GetByCode(string promoCode, CancellationToken cancellationToken)
    {
        return context.PromotionalCodes
            .AsNoTracking()
            .FirstOrDefaultAsync(pc => pc.Code == promoCode, cancellationToken);
    }
}