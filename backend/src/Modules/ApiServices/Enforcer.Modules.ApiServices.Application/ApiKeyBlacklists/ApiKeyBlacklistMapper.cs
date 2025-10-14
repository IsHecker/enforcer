using Enforcer.Modules.ApiServices.Contracts.ApiKeyBlacklist;
using Enforcer.Modules.ApiServices.Domain.Usages;

namespace Enforcer.Modules.ApiServices.Application.ApiKeyBlacklists;

public static class ApiKeyBlacklistMapper
{
    public static ApiKeyBlacklistResponse ToResponse(this ApiKeyBlacklist bl) =>
        new(
            bl.ApiKey,
            bl.Reason,
            bl.Duration,
            bl.BannedAt,
            bl.BannedBy
        );
}