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
            service.LogoUrl != null ? service.LogoUrl.ToString() : null,
            service.IsPublic,
            service.Status.ToString(),
            service.ApiDocId,
            service.Version
        );
}