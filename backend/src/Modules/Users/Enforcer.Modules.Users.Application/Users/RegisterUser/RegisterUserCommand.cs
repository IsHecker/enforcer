using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.Users.Application.Users.RegisterUser;

public sealed record RegisterUserCommand(string Email, string Password, string FirstName, string LastName)
    : ICommand<Guid>;