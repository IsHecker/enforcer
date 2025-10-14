using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.ListServiceSubscribers;

public record ListServiceSubscribersQuery(Guid ApiServiceId) : IQuery<IReadOnlyList<SubscriptionResponse>>;
