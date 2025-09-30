using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.DeleteApiService;

internal sealed class DeleteApiServiceCommandHandler(IApiServiceRepository apiServiceRepository) : ICommandHandler<DeleteApiServiceCommand>
{
    public async Task<Result> Handle(DeleteApiServiceCommand request, CancellationToken cancellationToken)
    {
        var apiService = await apiServiceRepository.GetByIdAsync(request.ApiServiceId, cancellationToken);

        if (apiService is null)
            return Result.Failure(ApiServiceErrors.NotFound(request.ApiServiceId));

        await apiServiceRepository.DeleteAsync(apiService, cancellationToken);

        return Result.Success;
    }
}