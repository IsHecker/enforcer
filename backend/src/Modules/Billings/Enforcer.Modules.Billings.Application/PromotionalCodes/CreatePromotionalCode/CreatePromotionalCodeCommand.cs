using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.Billings.Application.PromotionalCodes.CreatePromotionalCode;

public readonly record struct CreatePromotionalCodeCommand(
    Guid PlanId,
    string Code,
    string Type,
    int Value,
    int? MaxUses,
    int? MaxUsesPerUser,
    DateTime ValidFrom,
    DateTime? ValidUntil,
    Guid CreatedBy) : ICommand;