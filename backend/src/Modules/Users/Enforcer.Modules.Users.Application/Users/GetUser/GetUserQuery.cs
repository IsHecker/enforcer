using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.Users.Application.Users.GetUser;

public sealed record GetUserQuery(Guid UserId) : IQuery<UserResponse>;