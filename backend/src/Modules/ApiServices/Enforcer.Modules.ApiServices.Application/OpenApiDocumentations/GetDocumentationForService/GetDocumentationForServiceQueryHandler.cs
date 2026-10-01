using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.OpenApiDocumentations.GetDocumentationForService;

internal sealed class GetDocumentationForServiceQueryHandler(IApiServicesDbContext context)
    : IQueryHandler<GetDocumentationForServiceQuery, string>
{
    public async Task<Result<string>> Handle(GetDocumentationForServiceQuery query, CancellationToken cancellationToken)
    {
        var result = await context.OpenApiDocumentations
            .FirstOrDefaultAsync(doc => doc.ApiServiceId == query.ApiServiceId, cancellationToken);

        if (result is null)
            return ApiServiceErrors.NotFound(query.ApiServiceId);

        return result.Documentation;
    }
}