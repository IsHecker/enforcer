using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Analytics.Contracts;

namespace Enforcer.Modules.Analytics.Application.PlanStats.GetPlanStat;

public readonly record struct GetPlanStatQuery(Guid PlanId) : IQuery<PlanStatResponse>;