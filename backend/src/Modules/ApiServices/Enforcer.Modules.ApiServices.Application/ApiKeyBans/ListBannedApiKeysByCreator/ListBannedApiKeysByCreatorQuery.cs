using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.ApiKeyBlacklist;

namespace Enforcer.Modules.ApiServices.Application.ApiKeyBans.ListBannedApiKeysByCreator;

public readonly record struct ListBannedApiKeysByCreatorQuery(Guid CreatorId, Pagination Pagination)
    : IQuery<PagedResponse<ApiKeyBanResponse>>;