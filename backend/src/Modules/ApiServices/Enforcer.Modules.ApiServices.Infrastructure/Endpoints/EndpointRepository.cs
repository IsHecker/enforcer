using Enforcer.Modules.ApiServices.Application.Endpoints;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.Endpoints;

internal sealed class EndpointRepository(ApiServicesDbContext context) : IEndpointRepository
{
    public async Task AddAsync(Endpoint endpoint, CancellationToken cancellationToken = default)
    {
        await context.Endpoints.AddAsync(endpoint, cancellationToken);
    }

    public Task DeleteAsync(Endpoint endpoint, CancellationToken cancellationToken)
    {
        context.Endpoints.Remove(endpoint);
        return Task.CompletedTask;
    }

    public async Task<Endpoint?> GetByIdAsync(Guid endpointId, CancellationToken cancellationToken = default)
    {
        return await context.Endpoints
            .FirstOrDefaultAsync(e => e.Id == endpointId, cancellationToken);
    }

    public async Task<bool> IsRouteExistsAsync(
        Guid apiServiceId,
        HTTPMethod httpMethod,
        string publicPath,
        CancellationToken cancellationToken = default)
    {
        return await context.Endpoints
            .AsNoTracking()
            .AnyAsync(e =>
                e.ApiServiceId == apiServiceId &&
                e.HTTPMethod == httpMethod &&
                e.PublicPath == publicPath.ToLowerInvariant(),
                cancellationToken);
    }

    public Task UpdateAsync(Endpoint endpoint, CancellationToken cancellationToken = default)
    {
        context.Endpoints.Update(endpoint);
        return Task.CompletedTask;
    }
}