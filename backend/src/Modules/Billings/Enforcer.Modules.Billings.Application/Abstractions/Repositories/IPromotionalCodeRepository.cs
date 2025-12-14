using Enforcer.Common.Application.Data;
using Enforcer.Modules.Billings.Domain.PromotionalCodes;

namespace Enforcer.Modules.Billings.Application.Abstractions.Repositories;

public interface IPromotionalCodeRepository : IRepository<PromotionalCode>
{
    Task<PromotionalCode?> GetByCode(string code, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(string code, CancellationToken cancellationToken = default);
}