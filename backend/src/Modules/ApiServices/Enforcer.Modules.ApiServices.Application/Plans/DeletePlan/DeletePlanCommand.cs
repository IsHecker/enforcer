using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Plans.DeletePlan;

public readonly record struct DeletePlanCommand(Guid PlanId) : ICommand;