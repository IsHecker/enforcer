using Enforcer.Common.Application.Data;
using Enforcer.Modules.ApiServices.Domain.Endpoints;

namespace Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;

public interface IEndpointRepository : IRepository<Endpoint>
{
    Task<bool> IsRouteExistsAsync(
        Guid apiServiceId,
        HTTPMethod httpMethod,
        string publicPath,
        CancellationToken cancellationToken = default);
}