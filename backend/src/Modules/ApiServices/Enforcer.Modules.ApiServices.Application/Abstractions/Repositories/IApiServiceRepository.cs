using Enforcer.Common.Application.Data;
using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;

public interface IApiServiceRepository : IRepository<ApiService>
{
    Task<ApiService?> GetByServiceKeyAsync(string serviceKey, CancellationToken cancellationToken = default);
}