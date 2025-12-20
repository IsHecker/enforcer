using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Data;
using Enforcer.Modules.Billings.Contracts;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Application.Payouts.ListPayoutsByCreator;

internal sealed class ListPayoutsByCreatorQueryHandler(IBillingsDbContext context)
    : IQueryHandler<ListPayoutsByCreatorQuery, PagedResponse<PayoutResponse>>
{
    public async Task<Result<PagedResponse<PayoutResponse>>> Handle(ListPayoutsByCreatorQuery request,
        CancellationToken cancellationToken)
    {
        var query = context.Payouts
            .AsNoTracking()
            .Where(payout => payout.CreatorId == request.CreatorId);

        var totalCount = await query.CountAsync(cancellationToken);

        var response = await query
            .OrderByDescending(p => p.CreatedAt)
            .Paginate(request.Pagination)
            .Select(payout => payout.ToResponse())
            .ToPagedResponseAsync(request.Pagination, totalCount);

        return response;
    }
}