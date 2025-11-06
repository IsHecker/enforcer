using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Analytics.Application.Abstractions.Data;
using Enforcer.Modules.Analytics.Contracts;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Analytics.Application.EndpointStats.ListEndpointStats;

public sealed class ListEndpointStatsQueryHandler(IAnalyticsDbContext context)
    : IQueryHandler<ListEndpointStatsQuery, IEnumerable<EndpointStatResponse>>
{
    public async Task<Result<IEnumerable<EndpointStatResponse>>> Handle(
        ListEndpointStatsQuery request,
        CancellationToken cancellationToken)
    {
        if (request.EndpointIds == null || request.EndpointIds.Length == 0)
            return ((IEnumerable<EndpointStatResponse>)[]).ToResult();

        var endpointStats = await context.EndpointStats
            .AsNoTracking()
            .Where(es => request.EndpointIds.Contains(es.EndpointId))
            .Select(es => es.ToResponse())
            .ToListAsync(cancellationToken);

        return endpointStats;
    }
}