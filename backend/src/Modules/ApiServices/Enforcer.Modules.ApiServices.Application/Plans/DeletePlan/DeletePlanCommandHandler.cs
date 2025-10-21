using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.Plans.DeletePlan;

internal sealed class DeletePlanCommandHandler(IPlanRepository planRepository) : ICommandHandler<DeletePlanCommand>
{
    public async Task<Result> Handle(DeletePlanCommand request, CancellationToken cancellationToken)
    {
        var plan = await planRepository.GetByIdAsync(request.PlanId, cancellationToken);
        if (plan is null)
            return EndpointErrors.NotFound(request.PlanId);

        var deleteResult = plan.MarkAsDeleted();
        if (deleteResult.IsFailure)
            return deleteResult.Error;

        return Result.Success;
    }
}