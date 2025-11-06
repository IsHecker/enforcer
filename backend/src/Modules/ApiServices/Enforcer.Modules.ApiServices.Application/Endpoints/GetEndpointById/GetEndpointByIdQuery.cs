using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.GetEndpointById;

public readonly record struct GetEndpointByIdQuery(Guid EndpointId) : IQuery<EndpointResponse>;