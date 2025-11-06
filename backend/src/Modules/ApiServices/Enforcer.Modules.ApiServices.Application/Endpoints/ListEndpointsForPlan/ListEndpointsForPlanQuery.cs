using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.ListEndpointsForPlan;

public readonly record struct ListEndpointsForPlanQuery(Guid PlanId) : IQuery<IEnumerable<EndpointResponse>>;