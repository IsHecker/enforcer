using Enforcer.Common.Domain.Results;
using Enforcer.Common.Application.Authorization;
using MediatR;

namespace Enforcer.Modules.Users.Infrastructure.Authorization;

internal sealed class PermissionService(ISender sender) : IPermissionService
{
    public async Task<Result<PermissionsResponse>> GetUserPermissionsAsync(string identityId)
    {
        return null!;
    }
}