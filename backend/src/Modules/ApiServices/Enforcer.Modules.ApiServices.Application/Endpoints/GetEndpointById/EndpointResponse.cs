using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.GetEndpointById;

public record EndpointResponse(
    Guid Id,
    Guid ApiServiceId,
    Guid PlanId,
    HTTPMethod HttpMethod,
    string PublicPath,
    string TargetPath,
    int? RateLimit,
    RateLimitWindow? RateLimitWindow,
    bool IsActive
);