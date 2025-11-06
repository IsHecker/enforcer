using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.ListEndpointsForService;

public readonly record struct ListEndpointsForServiceQuery(Guid ApiServiceId) : IQuery<IEnumerable<EndpointResponse>>;