using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.Usages.Events;

namespace Enforcer.Modules.ApiServices.Domain.Usages;

public class ApiKeyBlacklist : Entity
{
    public string ApiKey { get; private set; } = null!;
    public string Reason { get; private set; } = null!;
    public DateTime? Duration { get; private set; }
    public DateTime BannedAt { get; private set; }
    public Guid BannedBy { get; private set; }
    public bool IsActive { get; private set; }

    private ApiKeyBlacklist() { }

    public static Result<ApiKeyBlacklist> Ban(string apiKey, string reason, Guid bannedBy, DateTime bannedAt, DateTime? duration = null)
    {
        if (string.IsNullOrWhiteSpace(apiKey))
            return ApiKeyBlacklistErrors.InvalidApiKey;

        if (string.IsNullOrWhiteSpace(reason))
            return ApiKeyBlacklistErrors.InvalidReason;

        if (bannedBy == Guid.Empty)
            return ApiKeyBlacklistErrors.InvalidBannedBy;

        if (duration is not null && duration <= bannedAt)
            return ApiKeyBlacklistErrors.InvalidDuration;

        var blacklist = new ApiKeyBlacklist
        {
            ApiKey = apiKey, // ⚠️ Hashing should happen before persistence
            Reason = reason,
            BannedAt = bannedAt,
            Duration = duration,
            BannedBy = bannedBy,
            IsActive = true
        };

        blacklist.Raise(new ApiKeyBannedEvent(blacklist.Id, blacklist.ApiKey, blacklist.Reason, blacklist.BannedAt, blacklist.Duration, blacklist.BannedBy));

        return blacklist;
    }

    public Result LiftBan(DateTime liftedAt)
    {
        if (!IsActive)
            return ApiKeyBlacklistErrors.AlreadyLifted;

        IsActive = false;

        Raise(new ApiKeyBanLiftedEvent(Id, ApiKey, liftedAt));

        return Result.Success;
    }

    public bool HasExpired(DateTime now) =>
        Duration is not null && now >= Duration;
}