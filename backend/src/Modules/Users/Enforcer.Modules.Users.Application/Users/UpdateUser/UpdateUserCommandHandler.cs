using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Users.Domain.Users;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Users.Application.Users.UpdateUser;

internal sealed class UpdateUserCommandHandler(
    IUserRepository userRepository,
    [FromKeyedServices(nameof(Users))] IUnitOfWork unitOfWork) : ICommandHandler<UpdateUserCommand>
{
    public async Task<Result> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        User? user = await userRepository.GetAsync(request.UserId, cancellationToken);

        if (user is null)
        {
            return Result.Failure(UserErrors.NotFound(request.UserId));
        }

        user.Update(request.FirstName, request.LastName);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success;
    }
}