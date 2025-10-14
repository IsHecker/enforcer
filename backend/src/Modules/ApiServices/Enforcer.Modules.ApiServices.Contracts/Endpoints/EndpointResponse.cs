namespace Enforcer.Modules.ApiServices.Contracts.Endpoints;

public sealed record EndpointResponse(
    Guid Id,
    Guid ApiServiceId,
    Guid PlanId,
    string HttpMethod,
    string PublicPath,
    string TargetPath,
    int? RateLimit,
    string? RateLimitWindow,
    bool IsActive
);