using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.UpdateEndpoint;

public record UpdateEndpointCommand(
    Guid PlanId,
    Guid EndpointId,
    string HttpMethod,
    string PublicPath,
    string TargetPath,
    int? RateLimit,
    string? RateLimitWindow,
    bool IsActive
) : ICommand;
