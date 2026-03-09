using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.Billings.Application.PromotionalCodes.DeletePromotionalCode;

public readonly record struct DeletePromotionalCodeCommand(Guid PromoCodeId) : ICommand;