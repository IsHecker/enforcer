using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Application.ApiServices.GetApiServiceById;
using Enforcer.Modules.ApiServices.Contracts.ApiServices;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.ListCreatorApiServices;

internal sealed class ListCreatorApiServicesQueryHandler(IApiServicesDbContext context)
    : IQueryHandler<ListCreatorApiServicesQuery, PagedResponse<ApiServiceResponse>>
{
    public async Task<Result<PagedResponse<ApiServiceResponse>>> Handle(
        ListCreatorApiServicesQuery request,
        CancellationToken cancellationToken)
    {
        var showPrivateServices = request.TargetCreatorId is not null
            && request.TargetCreatorId == request.CurrentCreatorId;

        var query = context.ApiServices
            .AsNoTracking()
            .Where(api => api.CreatorId == request.TargetCreatorId
                && showPrivateServices);

        var totalCount = await query.CountAsync(cancellationToken);

        var response = await query
            .OrderByDescending(s => s.CreatedAt)
            .Paginate(request.Pagination)
            .Select(service => service.ToResponse())
            .ToPagedResponseAsync(request.Pagination, totalCount);

        return response;
    }
}