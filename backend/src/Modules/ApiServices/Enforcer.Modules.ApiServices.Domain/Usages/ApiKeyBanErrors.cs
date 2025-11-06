using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.Usages;

public static class ApiKeyBanErrors
{
    public static Error NotFound(string apiKey) =>
        Error.NotFound("ApiKeyBan.NotFound", $"Api Key '{apiKey}' was not found.");

    public static readonly Error InvalidApiKey =
        Error.Validation("ApiKeyBan.InvalidApiKey", "API key must be provided.");

    public static readonly Error InvalidReason =
        Error.Validation("ApiKeyBan.InvalidReason", "A reason must be provided.");

    public static readonly Error InvalidBannedBy =
        Error.Validation("ApiKeyBan.InvalidBannedBy", "BannedBy cannot be empty.");

    public static readonly Error InvalidDuration =
        Error.Validation("ApiKeyBan.InvalidDuration", "Duration must be later than the ban date.");

    public static readonly Error AlreadyLifted =
        Error.Conflict("ApiKeyBan.AlreadyLifted", "This ban has already been lifted.");

    public static readonly Error AlreadyBanned =
        Error.Conflict("ApiKeyBan.AlreadyBanned", "This Api key is already banned.");
}
