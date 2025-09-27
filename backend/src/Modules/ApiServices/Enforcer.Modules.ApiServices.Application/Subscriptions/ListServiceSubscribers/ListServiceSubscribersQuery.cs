using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Application.Subscriptions.GetSubscriptionById;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.ListServiceSubscribers;

public record ListServiceSubscribersQuery(Guid ApiServiceId) : IQuery<IReadOnlyList<SubscriptionResponse>>;
