using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.GetSubscriptionById;

public record GetSubscriptionByIdQuery(Guid SubscriptionId) : IQuery<SubscriptionResponse>;

public static class SubscriptionMapping
{
    public static SubscriptionResponse ToResponse(this Subscription s) =>
        new()
        {
            Id = s.Id,
            ConsumerId = s.ConsumerId,
            PlanId = s.PlanId,
            ApiServiceId = s.ApiServiceId,
            ApiKey = s.ApiKey,
            SubscribedAt = s.SubscribedAt,
            ExpiresAt = s.ExpiresAt,
            IsCanceled = s.IsCanceled
        };
}