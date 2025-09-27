using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;

public interface IApiServiceRepository
{
    Task<ApiService?> GetByIdAsync(Guid serviceId, CancellationToken cancellationToken = default);

    Task<ApiService?> GetByServiceKeyAsync(string serviceKey, CancellationToken cancellationToken = default);

    Task AddAsync(ApiService apiService, CancellationToken cancellationToken = default);

    Task UpdateAsync(ApiService service, CancellationToken cancellationToken = default);

    Task DeleteAsync(ApiService service, CancellationToken cancellationToken = default);
}