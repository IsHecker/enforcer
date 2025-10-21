using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;

public interface IApiServiceRepository
{
    Task<ApiService?> GetByIdAsync(Guid apiServiceId, CancellationToken cancellationToken = default);

    Task<ApiService?> GetByServiceKeyAsync(string serviceKey, CancellationToken cancellationToken = default);

    Task AddAsync(ApiService apiService, CancellationToken cancellationToken = default);

    Task UpdateAsync(ApiService apiService, CancellationToken cancellationToken = default);

    Task DeleteAsync(ApiService apiService, CancellationToken cancellationToken = default);


    Task<bool> ExistsAsync(Guid apiServiceId, CancellationToken cancellationToken = default);
}