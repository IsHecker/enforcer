using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices;

public static class EndpointErrors
{
    public static readonly Error PublicPathEmpty =
        Error.Validation("Endpoint.PublicPathEmpty", "Public route cannot be empty.");

    public static readonly Error TargetPathEmpty =
        Error.Validation("Endpoint.TargetPathEmpty", "Target route cannot be empty.");

    public static readonly Error InvalidRateLimit =
        Error.Validation("Endpoint.InvalidRateLimit", "Rate limit must be greater than zero when provided.");

    public static readonly Error InvalidRateLimitWindow =
        Error.Validation("Endpoint.InvalidRateLimitWindow", "Rate limit window must be specified if rate limit is set.");

    public static readonly Error AlreadyActive =
        Error.Conflict("Endpoint.AlreadyActive", "Endpoint is already active.");

    public static readonly Error AlreadyInactive =
        Error.Conflict("Endpoint.AlreadyInactive", "Endpoint is already inactive.");
}