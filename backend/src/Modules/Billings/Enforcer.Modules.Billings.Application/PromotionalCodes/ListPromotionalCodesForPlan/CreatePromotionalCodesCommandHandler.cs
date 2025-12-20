using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Data;
using Enforcer.Modules.Billings.Contracts;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Application.PromotionalCodes.ListPromotionalCodesForPlan;

internal sealed class ListPromotionalCodesForPlanQueryHandler(IBillingsDbContext context)
    : IQueryHandler<ListPromotionalCodesForPlanQuery, PagedResponse<PromotionalCodeResponse>>
{
    public async Task<Result<PagedResponse<PromotionalCodeResponse>>> Handle(
        ListPromotionalCodesForPlanQuery request,
        CancellationToken cancellationToken)
    {
        var query = context.PromotionalCodes
            .AsNoTracking()
            .Where(promoCode =>
                promoCode.PlanId == request.PlanId
                && promoCode.CreatorId == request.CreatorId);

        var totalCount = await query.CountAsync(cancellationToken);

        var response = await query
            .OrderByDescending(s => s.CreatedAt)
            .Paginate(request.Pagination)
            .Select(promoCode => promoCode.ToResponse())
            .ToPagedResponseAsync(request.Pagination, totalCount);

        return response;
    }
}