using Enforcer.Modules.Users.Application.Users.GetUser;
using Enforcer.Modules.Users.Domain.Users;

namespace Enforcer.Modules.Users.Application.Users;

public static class UserMapper
{
    public static UserResponse ToResponse(this User user) =>
        new(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName);
}