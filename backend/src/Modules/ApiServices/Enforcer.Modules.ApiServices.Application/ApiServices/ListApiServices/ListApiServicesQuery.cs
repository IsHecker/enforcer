using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Application.ApiServices.GetApiServiceById;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.ListApiServices;

public sealed record ListApiServicesQuery(
    int PageNumber,
    int PageSize,
    string? Category,
    bool? IsPublic,
    string? Search
) : IQuery<IReadOnlyList<ApiServiceResponse>>;