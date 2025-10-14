namespace Enforcer.Modules.ApiServices.Contracts.ApiKeyBlacklist;

public sealed record ApiKeyBlacklistResponse(
    string ApiKey,
    string Reason,
    DateTime? Duration,
    DateTime BannedAt,
    Guid BannedBy)
{
    public bool HasExpired(DateTime now) =>
        Duration is not null && now >= Duration;
}