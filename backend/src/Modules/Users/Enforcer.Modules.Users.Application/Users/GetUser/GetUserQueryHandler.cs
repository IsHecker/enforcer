using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Users.Application.Abstractions.Data;
using Enforcer.Modules.Users.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Users.Application.Users.GetUser;

internal sealed class GetUserQueryHandler(IUsersDbContext context)
    : IQueryHandler<GetUserQuery, UserResponse>
{
    public async Task<Result<UserResponse>> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(user => user.Id == request.UserId, cancellationToken);

        if (user is null)
            return UserErrors.NotFound(request.UserId);

        return user.ToResponse();
    }
}