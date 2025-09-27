using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Plans.GetPlanById;

public sealed record GetPlanByIdQuery(Guid PlanId) : IQuery<PlanResponse?>;