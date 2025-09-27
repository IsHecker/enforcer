using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Plans.SetPlanStatus;

public sealed class SetPlanStatusCommandHandler(IPlanRepository planRepository) : ICommandHandler<SetPlanStatusCommand>
{
    public async Task<Result> Handle(SetPlanStatusCommand request, CancellationToken cancellationToken)
    {
        var plan = await planRepository.GetByIdAsync(request.PlanId, cancellationToken);

        if (plan is null)
            return PlanErrors.NotFound(request.PlanId);

        Result result = request.Activate
            ? plan.Activate()
            : plan.Deactivate();

        if (result.IsFailure)
            return result;

        return Result.Success;
    }
}