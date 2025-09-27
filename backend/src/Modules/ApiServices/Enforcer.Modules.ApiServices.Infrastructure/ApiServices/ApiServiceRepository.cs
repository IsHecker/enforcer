using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.ApiServices;

public class ApiServiceRepository(ApiServicesDbContext context) : IApiServiceRepository
{
    public async Task<ApiService?> GetByIdAsync(Guid serviceId, CancellationToken cancellationToken = default)
    {
        return await context.ApiServices
            .FirstOrDefaultAsync(s => s.Id == serviceId, cancellationToken);
    }

    public async Task<ApiService?> GetByServiceKeyAsync(string serviceKey, CancellationToken cancellationToken = default)
    {
        return await context.ApiServices
            .FirstOrDefaultAsync(s => string.Equals(s.ServiceKey, serviceKey, StringComparison.OrdinalIgnoreCase),
                cancellationToken);
    }

    public async Task AddAsync(ApiService apiService, CancellationToken cancellationToken = default)
    {
        await context.AddAsync(apiService, cancellationToken);
    }

    public Task UpdateAsync(ApiService service, CancellationToken cancellationToken = default)
    {
        context.ApiServices.Update(service);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(ApiService service, CancellationToken cancellationToken = default)
    {
        context.ApiServices.Remove(service);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await context.SaveChangesAsync(cancellationToken);
    }
}