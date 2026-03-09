using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.Application.PromotionalCodes.GetPromotionalCode;

public readonly record struct GetPromotionalCodeQuery(string PromoCode, Guid PlanId)
    : IQuery<PromotionalCodeResponse>;