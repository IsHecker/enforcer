using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.CreateEndpoint;

public sealed record CreateEndpointCommand(
    Guid ApiServiceId,
    Guid PlanId,
    string HttpMethod,
    string PublicPath,
    string TargetPath,
    int? RateLimit,
    string? RateLimitWindow,
    bool IsActive
) : ICommand<Guid>;