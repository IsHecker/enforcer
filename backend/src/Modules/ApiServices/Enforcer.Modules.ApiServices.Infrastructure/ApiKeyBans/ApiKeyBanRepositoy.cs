using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.ApiKeyBans;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.ApiKeyBans;

public class ApiKeyBanRepositoy(ApiServicesDbContext context)
    : Repository<ApiKeyBan>(context), IApiKeyBanRepositoy
{
    public Task<int> DeleteByApiKeyAsync(string apiKey, CancellationToken cancellationToken = default)
    {
        return context.ApiKeyBans.Where(ban => ban.ApiKey == apiKey).ExecuteDeleteAsync(cancellationToken);
    }

    public Task<bool> ExistsByApiKeyAsync(string apiKey, CancellationToken cancellationToken = default)
    {
        return context.ApiKeyBans.AnyAsync(ban => ban.ApiKey == apiKey, cancellationToken);
    }
}