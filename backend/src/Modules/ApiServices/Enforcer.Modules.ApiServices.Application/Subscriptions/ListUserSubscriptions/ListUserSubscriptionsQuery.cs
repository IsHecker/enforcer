using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.ListUserSubscriptions;

public record ListUserSubscriptionsQuery(Guid ConsumerId) : IQuery<IEnumerable<SubscriptionResponse>>;