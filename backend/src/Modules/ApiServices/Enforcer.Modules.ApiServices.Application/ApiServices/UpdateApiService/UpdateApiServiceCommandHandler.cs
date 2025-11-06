using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.UpdateApiService;

internal sealed class UpdateApiServiceCommandHandler(IApiServiceRepository apiServiceRepository) : ICommandHandler<UpdateApiServiceCommand>
{

    public async Task<Result> Handle(UpdateApiServiceCommand request, CancellationToken cancellationToken)
    {
        var service = await apiServiceRepository.GetByIdAsync(request.ApiServiceId, cancellationToken);

        if (service is null)
            return Result.Failure(ApiServiceErrors.NotFound(request.ApiServiceId));

        var updateResult = service.Update(
            request.Name,
            request.Description,
            request.Category.ToEnum<ApiCategory>(),
            request.ServiceKey,
            request.TargetBaseUrl,
            request.LogoUrl,
            request.IsPublic,
            request.Status.ToEnum<ServiceStatus>(),
            request.Version
        );

        if (updateResult.IsFailure)
            return updateResult.Error;

        apiServiceRepository.Update(service);

        return Result.Success;
    }
}