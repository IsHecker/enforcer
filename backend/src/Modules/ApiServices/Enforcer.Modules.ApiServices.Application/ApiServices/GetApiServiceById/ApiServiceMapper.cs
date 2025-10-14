using Enforcer.Modules.ApiServices.Contracts.ApiServices;
using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.GetApiServiceById;

public static class ApiServiceMapper
{
    public static ApiServiceResponse ToResponse(this ApiService service) =>
        new(
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