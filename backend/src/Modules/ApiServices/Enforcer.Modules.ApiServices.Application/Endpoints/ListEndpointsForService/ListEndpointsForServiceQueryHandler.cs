using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.ListEndpointsForService;

internal sealed class ListEndpointsForServiceQueryHandler(IApiServicesDbContext context)
    : IQueryHandler<ListEndpointsForServiceQuery, IEnumerable<EndpointResponse>>
{
    public async Task<Result<IEnumerable<EndpointResponse>>> Handle(ListEndpointsForServiceQuery request, CancellationToken cancellationToken)
    {
        var apiServiceExists = await context.ApiServices
            .AsNoTracking()
            .AnyAsync(s => s.Id == request.ApiServiceId, cancellationToken);

        if (!apiServiceExists)
            return ApiServiceErrors.NotFound(request.ApiServiceId);

        var endpoints = await context.Endpoints
            .AsNoTracking()
            .Where(e => e.ApiServiceId == request.ApiServiceId)
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