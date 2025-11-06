using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.ListServiceSubscribers;

public readonly record struct ListServiceSubscribersQuery(Guid ApiServiceId) : IQuery<IEnumerable<SubscriptionResponse>>;