using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.Endpoints;

public interface IEndpointRepository
{
    Task<Endpoint?> GetByIdAsync(Guid endpointId, CancellationToken cancellationToken = default);
    Task AddAsync(Endpoint endpoint, CancellationToken cancellationToken = default);
    Task UpdateAsync(Endpoint endpoint, CancellationToken cancellationToken = default);
    Task DeleteAsync(Endpoint endpoint, CancellationToken cancellationToken);
    Task<bool> IsRouteExistsAsync(Guid apiServiceId, HTTPMethod httpMethod, string publicPath, CancellationToken cancellationToken = default);
}