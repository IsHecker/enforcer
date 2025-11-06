using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Analytics.Contracts;

namespace Enforcer.Modules.Analytics.Application.EndpointStats.ListEndpointStats;

public readonly record struct ListEndpointStatsQuery(Guid[] EndpointIds)
    : IQuery<IEnumerable<EndpointStatResponse>>;