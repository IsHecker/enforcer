using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.SetApiServiceStatus;

internal sealed class SetApiServiceStatusCommandHandler(IApiServiceRepository apiServiceRepository)
    : ICommandHandler<SetApiServiceStatusCommand>
{
    public async Task<Result> Handle(SetApiServiceStatusCommand request, CancellationToken cancellationToken)
    {
        var apiService = await apiServiceRepository.GetByIdAsync(request.ApiServiceId, cancellationToken);

        if (apiService is null)
            return ApiServiceErrors.NotFound(request.ApiServiceId);

        Result result = request.Status.ToEnum<ServiceStatus>() switch
        {
            ServiceStatus.Published => apiService.Publish(),
            ServiceStatus.Deprecated => apiService.Deprecate(),
            _ => Result.Failure(ApiServiceErrors.InvalidStatusAction)
        };

        return result.IsFailure ? result.Error : Result.Success;
    }
}