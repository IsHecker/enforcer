using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.Application.PromotionalCodes.ListPromotionalCodesByPlan;

public readonly record struct ListPromotionalCodesByPlanQuery(Guid PlanId, Guid CreatorId, Pagination Pagination)
    : IQuery<PagedResponse<PromotionalCodeResponse>>;