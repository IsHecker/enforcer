using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.CreateApiService;

public class CreateApiServiceCommandHandler(IApiServiceRepository apiServiceRepository)
    : ICommandHandler<CreateApiServiceCommand, Guid>
{
    public async Task<Result<Guid>> Handle(CreateApiServiceCommand request, CancellationToken cancellationToken)
    {
        var existing = await apiServiceRepository.GetByServiceKeyAsync(request.ServiceKey, cancellationToken);
        if (existing is not null)
            return Error.Conflict("ApiService.ServiceKeyInUse", "Another ApiService already uses this Service Key.");

        var createResult = ApiService.Create(
           request.Name,
           request.Description ?? string.Empty,
           request.Category,
           request.ServiceKey,
           request.TargetBaseUrl,
           request.LogoUrl,
           request.IsPublic,
           request.Status
        );

        if (createResult.IsFailure)
            return createResult.Error;

        var apiService = createResult.Value;

        await apiServiceRepository.AddAsync(apiService, cancellationToken);

        return apiService.Id;
    }
}