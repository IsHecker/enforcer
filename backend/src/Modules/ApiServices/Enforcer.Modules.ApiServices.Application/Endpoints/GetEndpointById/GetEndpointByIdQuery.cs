using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.GetEndpointById;

public sealed record GetEndpointByIdQuery(Guid EndpointId) : IQuery<EndpointResponse>;