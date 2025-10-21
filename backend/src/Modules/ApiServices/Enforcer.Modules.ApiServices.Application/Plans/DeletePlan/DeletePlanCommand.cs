using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Plans.DeletePlan;

public record DeletePlanCommand(Guid PlanId) : ICommand;