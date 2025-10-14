using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.Plans.GetPlanById;

internal sealed class GetPlanByIdQueryHandler(IApiServicesDbContext context) : IQueryHandler<GetPlanByIdQuery, PlanResponse?>
{
    public async Task<Result<PlanResponse?>> Handle(GetPlanByIdQuery request, CancellationToken cancellationToken)
    {
        var plan = await context.Plans
            .AsNoTracking()
            .Include(p => p.Features)
            .Where(p => p.Id == request.PlanId)
            .Select(p => p.ToResponse())
            .FirstOrDefaultAsync(cancellationToken);

        if (plan is null)
            return PlanErrors.NotFound(request.PlanId);

        return plan;
    }
}