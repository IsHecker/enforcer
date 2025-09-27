using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.GetSubscriptionById;

public class GetSubscriptionByIdQueryHandler(IApiServicesDbContext context)
    : IQueryHandler<GetSubscriptionByIdQuery, SubscriptionResponse>
{
    public async Task<Result<SubscriptionResponse>> Handle(GetSubscriptionByIdQuery request, CancellationToken cancellationToken)
    {
        var subscriptionResponse = await context.Subscriptions
            .AsNoTracking()
            .Where(s => s.Id == request.SubscriptionId)
            .Select(s => s.ToResponse())
            .FirstOrDefaultAsync(cancellationToken);

        if (subscriptionResponse is null)
            return SubscriptionErrors.NotFound(request.SubscriptionId);

        return subscriptionResponse;
    }
}