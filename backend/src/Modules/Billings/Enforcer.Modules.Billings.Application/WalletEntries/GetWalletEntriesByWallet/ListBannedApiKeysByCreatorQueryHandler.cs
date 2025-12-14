using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Data;
using Enforcer.Modules.Billings.Contracts;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Application.WalletEntries.GetWalletEntriesByWallet;

internal sealed class GetWalletEntriesByWalletQueryHandler(IBillingsDbContext context)
    : IQueryHandler<GetWalletEntriesByWalletQuery, PagedResponse<WalletEntryResponse>>
{
    public async Task<Result<PagedResponse<WalletEntryResponse>>> Handle(GetWalletEntriesByWalletQuery request,
        CancellationToken cancellationToken)
    {
        var query = context.WalletEntries
            .AsNoTracking()
            .Where(entry => entry.WalletId == request.WalletId);

        var totalCount = await query.CountAsync(cancellationToken);

        var response = await query
            .OrderByDescending(s => s.CreatedAt)
            .Paginate(request.Pagination)
            .Select(ban => ban.ToResponse())
            .ToPagedResponseAsync(request.Pagination, totalCount);

        return response;
    }
}