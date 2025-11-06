using Enforcer.Modules.ApiServices.Contracts.ApiKeyBlacklist;
using Enforcer.Modules.ApiServices.Domain.Usages;

namespace Enforcer.Modules.ApiServices.Application.ApiKeyBans;

public static class ApiKeyBansMapper
{
    public static ApiKeyBanResponse ToResponse(this ApiKeyBan bl) =>
        new(
            bl.ApiKey,
            bl.Reason,
            bl.ExpiresAt,
            bl.BannedAt,
            bl.BannedBy
        );
}