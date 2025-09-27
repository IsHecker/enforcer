using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Application.Subscriptions.GetSubscriptionById;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.ListUserSubscriptions;

public record ListUserSubscriptionsQuery(Guid ConsumerId) : IQuery<IReadOnlyList<SubscriptionResponse>>;