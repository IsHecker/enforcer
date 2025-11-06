using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.ApiServices.ValueObjects;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.CreateApiService;

internal sealed class CreateApiServiceCommandHandler(IApiServiceRepository apiServiceRepository)
    : ICommandHandler<CreateApiServiceCommand, Guid>
{
    public async Task<Result<Guid>> Handle(CreateApiServiceCommand request, CancellationToken cancellationToken)
    {
        var keyResult = ServiceKey.Create(request.ServiceKey);
        if (keyResult.IsFailure)
            return keyResult.Error;

        var serviceKey = keyResult.Value;

        var existing = await apiServiceRepository.GetByServiceKeyAsync(serviceKey.Value, cancellationToken);

        if (existing is not null)
            return ApiServiceErrors.ServiceKeyInUse;

        var createResult = ApiService.Create(
            request.CreatorId,
            request.Name,
            request.Description ?? string.Empty,
            request.Category.ToEnum<ApiCategory>(),
            serviceKey.Value,
            request.TargetBaseUrl,
            request.LogoUrl,
            request.IsPublic,
            request.Status.ToEnum<ServiceStatus>()
        );

        if (createResult.IsFailure)
            return createResult.Error;

        var apiService = createResult.Value;

        await apiServiceRepository.AddAsync(apiService, cancellationToken);

        return apiService.Id;
    }
}