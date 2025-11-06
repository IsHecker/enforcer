using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Application.ApiKeyBans.ListBannedApiKeysByCreator;
using Enforcer.Modules.ApiServices.Contracts.ApiKeyBlacklist;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.ApiKeyBans.ListBannedApiKeys;

internal sealed class ListBannedApiKeysByCreatorQueryHandler(IApiServicesDbContext context)
    : IQueryHandler<ListBannedApiKeysByCreatorQuery, PagedResponse<ApiKeyBanResponse>>
{
    public async Task<Result<PagedResponse<ApiKeyBanResponse>>> Handle(ListBannedApiKeysByCreatorQuery request,
        CancellationToken cancellationToken)
    {
        var query = context.ApiKeyBans
            .AsNoTracking()
            .Where(api => api.BannedBy == request.CreatorId);

        var totalCount = await query.CountAsync(cancellationToken);

        var response = await query
            .OrderByDescending(s => s.CreatedAt)
            .Paginate(request.Pagination)
            .Select(ban => ban.ToResponse())
            .ToPagedResponseAsync(request.Pagination, totalCount);

        return response;
    }
}