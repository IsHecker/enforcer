using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Contracts.ApiServices;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.ListApiServices;

internal sealed class ListApiServicesQueryHandler(IApiServicesDbContext context)
    : IQueryHandler<ListApiServicesQuery, IReadOnlyList<ApiServiceResponse>>
{
    public async Task<Result<IReadOnlyList<ApiServiceResponse>>> Handle(ListApiServicesQuery request, CancellationToken cancellationToken)
    {
        var query = context.ApiServices.AsNoTracking().AsQueryable();

        if (request.Category is not null)
            query = query.Where(s => s.Category == request.Category.ToEnum<ApiCategory>());

        if (!string.IsNullOrWhiteSpace(request.Search))
            query = query.Where(s => s.Name.Contains(request.Search));


        query = query
            .OrderBy(s => s.Name)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize);

        var services = await query
            .Select(service => new ApiServiceResponse(
                service.Id,
                service.Name,
                service.Description,
                service.Category.ToString(),
                service.ServiceKey,
                service.TargetBaseUrl.ToString(),
                service.LogoUrl != null ? service.LogoUrl.ToString() : null,
                service.IsPublic,
                service.Status.ToString(),
                service.SubscriptionsCount,
                service.ApiDocId,
                service.Version
            ))
            .ToListAsync(cancellationToken);

        return services.ToResult<IReadOnlyList<ApiServiceResponse>>();
    }
}