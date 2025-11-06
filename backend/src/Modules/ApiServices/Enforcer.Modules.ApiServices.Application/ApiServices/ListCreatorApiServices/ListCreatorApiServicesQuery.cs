using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.ListCreatorApiServices;

public readonly record struct ListCreatorApiServicesQuery(
    Guid? TargetCreatorId,
    Guid CurrentCreatorId,
    Pagination Pagination
) : IQuery<PagedResponse<ApiServiceResponse>>;