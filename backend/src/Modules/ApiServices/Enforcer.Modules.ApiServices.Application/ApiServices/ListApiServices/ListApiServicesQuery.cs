using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.ListApiServices;

public readonly record struct ListApiServicesQuery(
    string? Category,
    string? Search,
    Pagination Pagination
) : IQuery<PagedResponse<ApiServiceResponse>>;