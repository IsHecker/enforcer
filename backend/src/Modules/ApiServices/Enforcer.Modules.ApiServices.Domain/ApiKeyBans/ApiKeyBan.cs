using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.ApiKeyBans;

public sealed class ApiKeyBan : Entity
{
    public string ApiKey { get; private set; } = null!;
    public string Reason { get; private set; } = null!;
    public DateTime? ExpiresAt { get; private set; }
    public DateTime BannedAt { get; private set; }
    public Guid BannedBy { get; private set; }

    private ApiKeyBan() { }

    public static Result<ApiKeyBan> Create(
        string apiKey,
        string reason,
        Guid bannedBy,
        DateTime? expiresAt = null)
    {
        var bannedAt = DateTime.UtcNow;

        if (string.IsNullOrWhiteSpace(apiKey))
            return ApiKeyBanErrors.InvalidApiKey;

        if (string.IsNullOrWhiteSpace(reason))
            return ApiKeyBanErrors.InvalidReason;

        if (bannedBy == Guid.Empty)
            return ApiKeyBanErrors.InvalidBannedBy;

        if (expiresAt is not null && expiresAt <= bannedAt)
            return ApiKeyBanErrors.InvalidDuration;

        var ban = new ApiKeyBan
        {
            ApiKey = apiKey,
            Reason = reason,
            BannedAt = bannedAt,
            ExpiresAt = expiresAt,
            BannedBy = bannedBy
        };

        return ban;
    }

    public bool HasExpired(DateTime now) =>
        ExpiresAt is not null && now >= ExpiresAt;
}