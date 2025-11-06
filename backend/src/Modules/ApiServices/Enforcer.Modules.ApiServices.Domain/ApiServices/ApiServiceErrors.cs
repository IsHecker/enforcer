using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices;

public static class ApiServiceErrors
{
    public static Error NotFound(Guid serviceId) =>
        Error.NotFound("ApiService.NotFound", $"ApiService with ID '{serviceId}' was not found.");

    public static Error VersionMustBeHigher(string current, string newVersion) =>
        Error.Validation("ApiService.VersionMustBeHigher",
            $"New version '{newVersion}' must be higher than the current version '{current}'.");

    public static readonly Error NameEmpty =
        Error.Validation("ApiService.NameEmpty", "Name cannot be empty.");

    public static readonly Error DescriptionTooLong =
        Error.Validation("ApiService.DescriptionTooLong", "Description exceeds 400 characters.");

    public static readonly Error InvalidCreatorId =
        Error.Validation("ApiService.InvalidCreatorId", "The CreatorId cannot be empty.");

    public static readonly Error InvalidServiceKey = Error.Validation(
            "ApiService.InvalidServiceKey",
            "Service Key must contain only lowercase letters and single hyphens between words.");

    public static readonly Error TargetBaseUrlRequired =
        Error.Validation("ApiService.TargetBaseUrlRequired", "Target URL is required.");

    public static readonly Error AlreadyPublished =
        Error.Conflict("ApiService.AlreadyPublished", "Service is already published.");

    public static readonly Error AlreadyDeprecated =
        Error.Conflict("ApiService.AlreadyDeprecated", "Service is already deprecated.");

    public static readonly Error ServiceKeyInUse =
        Error.Conflict("ApiService.ServiceKeyInUse", "Another ApiService already uses this Service Key.");
}