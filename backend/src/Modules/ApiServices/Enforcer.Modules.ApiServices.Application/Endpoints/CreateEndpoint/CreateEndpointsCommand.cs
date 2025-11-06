using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.CreateEndpoint;

public readonly record struct CreateEndpointsCommand(
    Guid ApiServiceId,
    IEnumerable<EndpointCreationData> Endpoints
) : ICommand<IEnumerable<Guid>>;

public readonly record struct EndpointCreationData(
    Guid PlanId,
    string HttpMethod,
    string PublicPath,
    string TargetPath,
    int? RateLimit,
    string? RateLimitWindow,
    bool IsActive
);