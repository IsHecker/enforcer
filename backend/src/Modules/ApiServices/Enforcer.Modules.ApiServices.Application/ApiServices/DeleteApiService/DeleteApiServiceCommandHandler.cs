using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.DeleteApiService;

internal sealed class DeleteApiServiceCommandHandler(IApiServiceRepository apiServiceRepository)
    : ICommandHandler<DeleteApiServiceCommand>
{
    public async Task<Result> Handle(DeleteApiServiceCommand request, CancellationToken cancellationToken)
    {
        var deleteCount = await apiServiceRepository.DeleteAsync(request.ApiServiceId, cancellationToken);

        if (deleteCount <= 0)
            return ApiServiceErrors.NotFound(request.ApiServiceId);

        return Result.Success;
    }
}