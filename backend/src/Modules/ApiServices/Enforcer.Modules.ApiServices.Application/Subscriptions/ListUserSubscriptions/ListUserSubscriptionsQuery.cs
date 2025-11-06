using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.ListUserSubscriptions;

public readonly record struct ListUserSubscriptionsQuery(Guid ConsumerId) : IQuery<IEnumerable<SubscriptionResponse>>;