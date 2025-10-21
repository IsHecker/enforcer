using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Application.Plans.GetPlanById;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.Plans.ListPlansForService;

internal sealed class ListPlansForServiceQueryHandler(IApiServicesDbContext context) : IQueryHandler<ListPlansForServiceQuery, IReadOnlyList<PlanResponse>>
{
    public async Task<Result<IReadOnlyList<PlanResponse>>> Handle(ListPlansForServiceQuery request, CancellationToken cancellationToken)
    {
        var plans = await context.Plans
            .AsNoTracking()
            .Include(p => p.Features)
            .Where(p => p.ApiServiceId == request.ApiServiceId && !p.IsDeleted)
            .Select(p => p.ToResponse())
            .ToListAsync(cancellationToken);

        return plans;
    }
}