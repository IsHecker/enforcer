using Enforcer.Common.Application.Data;
using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.Endpoints;

public interface IEndpointRepository : IRepository<Endpoint>
{
    Task<bool> IsRouteExistsAsync(
        Guid apiServiceId,
        HTTPMethod httpMethod,
        string publicPath,
        CancellationToken ct = default);
}