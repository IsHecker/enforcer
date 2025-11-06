using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Application.ApiServices.GetApiServiceById;
using Enforcer.Modules.ApiServices.Contracts.ApiServices;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.ListApiServices;

internal sealed class ListApiServicesQueryHandler(IApiServicesDbContext context)
    : IQueryHandler<ListApiServicesQuery, PagedResponse<ApiServiceResponse>>
{
    public async Task<Result<PagedResponse<ApiServiceResponse>>> Handle(
        ListApiServicesQuery request,
        CancellationToken cancellationToken)
    {
        var query = context.ApiServices.AsNoTracking();

        if (request.Category is not null)
            query = query.Where(s => s.Category == request.Category.ToEnum<ApiCategory>());

        if (!string.IsNullOrWhiteSpace(request.Search))
            query = query.Where(s => s.Name.Contains(request.Search));

        var totalCount = await query.CountAsync(cancellationToken);

        var response = await query
            .OrderBy(s => s.Name)
            .Paginate(request.Pagination)
            .Select(service => service.ToResponse())
            .ToPagedResponseAsync(request.Pagination, totalCount);

        return response;
    }
}