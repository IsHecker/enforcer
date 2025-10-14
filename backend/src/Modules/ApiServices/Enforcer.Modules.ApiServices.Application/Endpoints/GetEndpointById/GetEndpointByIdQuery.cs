using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.GetEndpointById;

public sealed record GetEndpointByIdQuery(Guid EndpointId) : IQuery<EndpointResponse>;