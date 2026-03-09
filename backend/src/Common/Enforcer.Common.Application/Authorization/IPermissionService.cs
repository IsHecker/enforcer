using Enforcer.Common.Domain.Results;

namespace Enforcer.Common.Application.Authorization;

public interface IPermissionService
{
    Task<Result<PermissionsResponse>> GetUserPermissionsAsync(string identityId);
}