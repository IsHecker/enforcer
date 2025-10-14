using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.ListEndpointsForPlan;

internal sealed class ListEndpointsForPlanQueryHandler(IApiServicesDbContext context)
    : IQueryHandler<ListEndpointsForPlanQuery, IEnumerable<EndpointResponse>>
{
    public async Task<Result<IEnumerable<EndpointResponse>>> Handle(ListEndpointsForPlanQuery request, CancellationToken cancellationToken)
    {
        var planExists = await context.Plans
            .AsNoTracking()
            .AnyAsync(p => p.Id == request.PlanId, cancellationToken);

        if (!planExists)
            return PlanErrors.NotFound(request.PlanId);

        var endpoints = await context.Endpoints
            .AsNoTracking()
            .Where(e => e.PlanId == request.PlanId)
            .ToListAsync(cancellationToken);

        var response = endpoints.Select(e => new EndpointResponse(
            e.Id,
            e.ApiServiceId,
            e.PlanId,
            e.HTTPMethod.ToString(),
            e.PublicPath,
            e.TargetPath,
            e.RateLimit,
            e.RateLimitWindow.ToString(),
            e.IsActive
        )).ToList();

        return response;
    }
}