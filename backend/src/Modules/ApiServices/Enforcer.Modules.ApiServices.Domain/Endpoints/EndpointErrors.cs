using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.Endpoints;

public static class EndpointErrors
{
    public static Error NotFound(Guid id) =>
        Error.NotFound("Endpoint.NotFound", $"Endpoint with id '{id}' was not found.");

    public static readonly Error InvalidRateLimit =
        Error.Validation("Endpoint.InvalidRateLimit", "Rate limit must be greater than zero when provided.");

    public static readonly Error InvalidRateLimitWindow =
        Error.Validation("Endpoint.InvalidRateLimitWindow", "Rate limit window must be specified if rate limit is set.");

    public static readonly Error InvalidPublicPath =
        Error.Validation("Endpoint.InvalidPublicPath", "Public path is invalid.");

    public static readonly Error AlreadyActive =
        Error.Conflict("Endpoint.AlreadyActive", "Endpoint is already active.");

    public static readonly Error AlreadyInactive =
        Error.Conflict("Endpoint.AlreadyInactive", "Endpoint is already inactive.");

    public static readonly Error DuplicateRoute =
        Error.Conflict("Endpoint.DuplicateRoute", "An endpoint with the same route (HTTP method + public path) already exists for this service.");
}