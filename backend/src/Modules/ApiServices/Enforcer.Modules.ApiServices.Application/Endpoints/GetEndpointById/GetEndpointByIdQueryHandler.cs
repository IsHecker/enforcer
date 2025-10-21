using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.GetEndpointById;

internal sealed class GetEndpointByIdQueryHandler(IApiServicesDbContext context)
    : IQueryHandler<GetEndpointByIdQuery, EndpointResponse>
{
    public async Task<Result<EndpointResponse>> Handle(GetEndpointByIdQuery request, CancellationToken cancellationToken)
    {
        var endpoint = await context.Endpoints
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == request.EndpointId, cancellationToken);

        if (endpoint is null)
            return EndpointErrors.NotFound(request.EndpointId);

        return endpoint.ToResponse();
    }
}