using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.ApiServices.Application.Endpoints;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.Endpoints;

internal sealed class EndpointRepository(ApiServicesDbContext context) : Repository<Endpoint>(context), IEndpointRepository
{
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
                e.PublicPath == publicPath, cancellationToken);
    }
}