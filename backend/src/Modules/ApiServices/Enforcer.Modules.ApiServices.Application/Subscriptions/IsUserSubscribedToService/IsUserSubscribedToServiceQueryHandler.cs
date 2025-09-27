using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.IsUserSubscribedToService;

public class IsUserSubscribedToServiceQueryHandler(IApiServicesDbContext context) : IQueryHandler<IsUserSubscribedToServiceQuery, bool>
{
    public async Task<Result<bool>> Handle(IsUserSubscribedToServiceQuery request, CancellationToken cancellationToken)
    {
        if (request.ConsumerId == Guid.Empty)
            return SubscriptionErrors.InvalidConsumerId;

        if (request.ApiServiceId == Guid.Empty)
            return ApiServiceErrors.NotFound(request.ApiServiceId);

        var existsActive = await context.Subscriptions
            .AnyAsync(s =>
                s.ConsumerId == request.ConsumerId &&
                s.ApiServiceId == request.ApiServiceId &&
                !s.IsExpired,
                cancellationToken);

        return existsActive;
    }
}