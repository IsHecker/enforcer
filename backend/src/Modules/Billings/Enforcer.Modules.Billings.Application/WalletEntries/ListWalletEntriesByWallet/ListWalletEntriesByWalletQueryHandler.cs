using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Data;
using Enforcer.Modules.Billings.Contracts;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Application.WalletEntries.ListWalletEntriesByWallet;

internal sealed class ListWalletEntriesByWalletQueryHandler(IBillingsDbContext context)
    : IQueryHandler<ListWalletEntriesByWalletQuery, PagedResponse<WalletEntryResponse>>
{
    public async Task<Result<PagedResponse<WalletEntryResponse>>> Handle(ListWalletEntriesByWalletQuery request,
        CancellationToken cancellationToken)
    {
        var query = context.WalletEntries
            .AsNoTracking()
            .Where(entry => entry.WalletId == request.WalletId);

        var totalCount = await query.CountAsync(cancellationToken);

        var response = await query
            .OrderByDescending(s => s.CreatedAt)
            .Paginate(request.Pagination)
            .Select(entry => entry.ToResponse())
            .ToPagedResponseAsync(request.Pagination, totalCount);

        return response;
    }
}