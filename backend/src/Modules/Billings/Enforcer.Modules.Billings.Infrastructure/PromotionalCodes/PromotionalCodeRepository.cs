using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.PromotionalCodes;
using Enforcer.Modules.Billings.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Infrastructure.PromotionalCodes;

internal sealed class PromotionalCodeRepository(BillingsDbContext context)
    : Repository<PromotionalCode>(context), IPromotionalCodeRepository
{
    public Task<bool> ExistsAsync(string code, CancellationToken cancellationToken = default)
    {
        return context.PromotionalCodes
            .AnyAsync(pc => pc.Code == code, cancellationToken);
    }

    public Task<PromotionalCode?> GetByCode(string code, CancellationToken cancellationToken = default)
    {
        return context.PromotionalCodes
            .AsNoTracking()
            .FirstOrDefaultAsync(pc => pc.Code == code, cancellationToken);
    }
}