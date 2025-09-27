using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.Usages;

public static class ApiKeyBlacklistErrors
{
    public static readonly Error InvalidApiKey =
        Error.Validation("ApiKeyBlacklist.InvalidApiKey", "API key must be provided.");

    public static readonly Error InvalidReason =
        Error.Validation("ApiKeyBlacklist.InvalidReason", "A reason must be provided.");

    public static readonly Error InvalidBannedBy =
        Error.Validation("ApiKeyBlacklist.InvalidBannedBy", "BannedBy cannot be empty.");

    public static readonly Error InvalidDuration =
        Error.Validation("ApiKeyBlacklist.InvalidDuration", "Duration must be later than the ban date.");

    public static readonly Error AlreadyLifted =
        Error.Conflict("ApiKeyBlacklist.AlreadyLifted", "This ban has already been lifted.");
}
