using Enforcer.Modules.ApiServices.Contracts.Endpoints;
using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.GetEndpointById;

public static class EndpointMapper
{
    public static EndpointResponse ToResponse(this Endpoint e) =>
        new EndpointResponse(
            e.Id,
            e.ApiServiceId,
            e.PlanId,
            e.HTTPMethod.ToString(),
            e.PublicPath,
            e.TargetPath,
            e.RateLimit,
            e.RateLimitWindow,
            e.IsActive
        );
}