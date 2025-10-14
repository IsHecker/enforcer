using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Application.Subscriptions.GetSubscriptionById;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.ListServiceSubscribers;

internal sealed class ListServiceSubscribersQueryHandler(IApiServicesDbContext context) :
    IQueryHandler<ListServiceSubscribersQuery, IReadOnlyList<SubscriptionResponse>>
{
    public async Task<Result<IReadOnlyList<SubscriptionResponse>>> Handle(ListServiceSubscribersQuery request,
        CancellationToken cancellationToken)
    {
        if (request.ApiServiceId == Guid.Empty)
            return SubscriptionErrors.InvalidPlan;

        var dtos = await context.Subscriptions
            .Where(s => s.ApiServiceId == request.ApiServiceId)
            .Select(s => s.ToResponse())
            .ToListAsync(cancellationToken);

        return dtos.AsReadOnly();
    }
}