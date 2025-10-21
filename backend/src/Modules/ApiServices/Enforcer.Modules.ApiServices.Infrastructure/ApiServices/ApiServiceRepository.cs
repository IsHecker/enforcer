using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.ApiServices;

internal sealed class ApiServiceRepository(ApiServicesDbContext context) : IApiServiceRepository
{
    public async Task<ApiService?> GetByIdAsync(Guid apiServiceId, CancellationToken cancellationToken = default)
    {
        return await context.ApiServices
            .AsNoTracking()
            .FirstOrDefaultAsync(api => api.Id == apiServiceId, cancellationToken);
    }

    public async Task<ApiService?> GetByServiceKeyAsync(string serviceKey, CancellationToken cancellationToken = default)
    {
        return await context.ApiServices
            .AsNoTracking()
            .FirstOrDefaultAsync(api => api.ServiceKey == serviceKey.ToLowerInvariant(), cancellationToken);
    }

    public async Task AddAsync(ApiService apiService, CancellationToken cancellationToken = default)
    {
        await context.AddAsync(apiService, cancellationToken);
    }

    public Task UpdateAsync(ApiService apiService, CancellationToken cancellationToken = default)
    {
        context.ApiServices.Update(apiService);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(ApiService apiService, CancellationToken cancellationToken = default)
    {
        context.ApiServices.Remove(apiService);
        return Task.CompletedTask;
    }

    public async Task<bool> ExistsAsync(Guid apiServiceId, CancellationToken cancellationToken = default)
    {
        return await context.ApiServices
            .AsNoTracking()
            .AnyAsync(api => api.Id == apiServiceId, cancellationToken);
    }
}