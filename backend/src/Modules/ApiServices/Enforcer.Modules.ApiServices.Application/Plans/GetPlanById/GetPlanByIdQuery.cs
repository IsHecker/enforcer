using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.Plans;

namespace Enforcer.Modules.ApiServices.Application.Plans.GetPlanById;

public sealed record GetPlanByIdQuery(Guid PlanId) : IQuery<PlanResponse?>;