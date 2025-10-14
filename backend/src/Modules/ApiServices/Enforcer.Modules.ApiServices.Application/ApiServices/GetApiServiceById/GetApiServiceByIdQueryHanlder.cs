using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Contracts.ApiServices;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.GetApiServiceById;

internal sealed class GetApiServiceByIdQueryHanlder(IApiServicesDbContext context)
    : IQueryHandler<GetApiServiceByIdQuery, ApiServiceResponse>
{
    public async Task<Result<ApiServiceResponse>> Handle(GetApiServiceByIdQuery request, CancellationToken cancellationToken)
    {
        var service = await context.ApiServices
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == request.ApiServiceId, cancellationToken);

        if (service is null)
            return ApiServiceErrors.NotFound(request.ApiServiceId);

        return new ApiServiceResponse(
            service.Id,
            service.Name,
            service.Description,
            service.Category.ToString(),
            service.ServiceKey,
            service.TargetBaseUrl.ToString(),
            service.LogoUrl?.ToString(),
            service.IsPublic,
            service.Status.ToString(),
            service.SubscriptionsCount,
            service.ApiDocId,
            service.Version
        );
    }
}