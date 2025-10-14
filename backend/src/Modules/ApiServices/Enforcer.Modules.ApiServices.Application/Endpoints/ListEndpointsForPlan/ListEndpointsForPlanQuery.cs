using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.ListEndpointsForPlan;

public sealed record ListEndpointsForPlanQuery(Guid PlanId) : IQuery<IEnumerable<EndpointResponse>>;