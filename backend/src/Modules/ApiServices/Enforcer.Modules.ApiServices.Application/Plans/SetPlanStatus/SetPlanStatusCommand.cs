using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Plans.SetPlanStatus;

public sealed record SetPlanStatusCommand(Guid PlanId, bool Activate) : ICommand;