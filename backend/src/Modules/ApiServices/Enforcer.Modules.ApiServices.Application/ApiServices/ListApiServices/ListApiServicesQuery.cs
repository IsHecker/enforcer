using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Application.ApiServices.GetApiServiceById;
using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.ListApiServices;

public sealed record ListApiServicesQuery(
    int PageNumber = 1,
    int PageSize = 20,
    ApiCategory? Category = null,
    bool? IsPublic = null,
    string? Search = null) : IQuery<IReadOnlyList<ApiServiceResponse>>;