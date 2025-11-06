using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.ApiServices;

internal sealed class ApiServiceRepository(ApiServicesDbContext context)
    : Repository<ApiService>(context), IApiServiceRepository
{
    public async Task<ApiService?> GetByServiceKeyAsync(string serviceKey, CancellationToken ct = default)
    {
        return await context.ApiServices
            .AsNoTracking()
            .FirstOrDefaultAsync(api => api.ServiceKey == serviceKey, ct);
    }
}