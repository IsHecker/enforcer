using Enforcer.Common.Domain.Enums.ApiServices;

namespace Enforcer.Modules.ApiServices.Contracts.Endpoints;

public sealed record EndpointResponse(
    Guid Id,
    Guid ApiServiceId,
    Guid PlanId,
    string HttpMethod,
    string PublicPath,
    string TargetPath,
    int? RateLimit,
    RateLimitWindow? RateLimitWindow,
    bool IsActive
);