using Enforcer.Common.Application.Data;
using Enforcer.Modules.ApiServices.Domain.Usages;

namespace Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;

public interface IApiKeyBanRepositoy : IRepository<ApiKeyBan>
{
    Task<bool> ExistsByApiKeyAsync(string apiKey, CancellationToken ct = default);

    Task<int> DeleteByApiKeyAsync(string apiKey, CancellationToken ct = default);
}