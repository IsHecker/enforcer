using Enforcer.Modules.Billings.Contracts;
using Enforcer.Modules.Billings.Domain.PromotionalCodes;

namespace Enforcer.Modules.Billings.Application.PromotionalCodes;

public static class PromotionalCodeMapper
{
    public static PromotionalCodeResponse ToResponse(this PromotionalCode promotionalCode) =>
        new(
            promotionalCode.Id,
            promotionalCode.Code,
            promotionalCode.Type.ToString(),
            promotionalCode.Value,
            promotionalCode.MaxUses,
            promotionalCode.MaxUsesPerUser,
            promotionalCode.UsedCount,
            promotionalCode.IsActive,
            promotionalCode.ValidFrom,
            promotionalCode.ValidUntil
        );
}