using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.Users.Application.Users.UpdateUser;

public sealed record UpdateUserCommand(Guid UserId, string FirstName, string LastName) : ICommand;