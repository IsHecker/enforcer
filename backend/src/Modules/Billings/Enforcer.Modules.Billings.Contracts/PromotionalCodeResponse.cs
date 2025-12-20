namespace Enforcer.Modules.Billings.Contracts;

public sealed record PromotionalCodeResponse(
    Guid Id,
    string Code,
    string Type,
    int Value,
    int? MaxUses,
    int? MaxUsesPerUser,
    int UsedCount,
    bool IsActive,
    DateTime ValidFrom,
    DateTime? ValidUntil = null);