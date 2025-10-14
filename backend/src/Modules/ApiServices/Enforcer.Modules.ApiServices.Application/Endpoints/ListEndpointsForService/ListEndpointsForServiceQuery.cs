using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.ListEndpointsForService;

public sealed record ListEndpointsForServiceQuery(Guid ApiServiceId) : IQuery<IEnumerable<EndpointResponse>>;