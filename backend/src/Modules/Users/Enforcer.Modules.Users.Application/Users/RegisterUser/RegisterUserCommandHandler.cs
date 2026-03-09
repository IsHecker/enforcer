using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Users.Application.Abstractions.Identity;
using Enforcer.Modules.Users.Domain.Users;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Users.Application.Users.RegisterUser;

internal sealed class RegisterUserCommandHandler(
    IIdentityProviderService identityProviderService,
    IUserRepository userRepository,
    [FromKeyedServices(nameof(Users))] IUnitOfWork unitOfWork) : ICommandHandler<RegisterUserCommand, Guid>
{
    public async Task<Result<Guid>> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        Result<string> result = await identityProviderService.RegisterUserAsync(
            new UserModel(request.Email, request.Password, request.FirstName, request.LastName),
            cancellationToken);

        if (result.IsFailure)
        {
            return Result.Failure<Guid>(result.Error);
        }

        var user = User.Create(request.Email, request.FirstName, request.LastName, result.Value);

        userRepository.Insert(user);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return user.Id;
    }
}