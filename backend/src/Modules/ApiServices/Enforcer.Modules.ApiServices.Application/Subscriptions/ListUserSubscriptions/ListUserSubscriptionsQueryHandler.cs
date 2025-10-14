using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Application.Subscriptions.GetSubscriptionById;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.ListUserSubscriptions;

internal sealed class ListUserSubscriptionsQueryHandler(IApiServicesDbContext context) :
    IQueryHandler<ListUserSubscriptionsQuery, IReadOnlyList<SubscriptionResponse>>
{
    public async Task<Result<IReadOnlyList<SubscriptionResponse>>> Handle(ListUserSubscriptionsQuery request,
        CancellationToken cancellationToken)
    {
        if (request.ConsumerId == Guid.Empty)
            return SubscriptionErrors.InvalidConsumerId;

        var subscriptionsResponse = await context.Subscriptions
            .Where(s => s.ConsumerId == request.ConsumerId)
            .Select(s => s.ToResponse())
            .ToListAsync(cancellationToken);

        return subscriptionsResponse.AsReadOnly();
    }
}