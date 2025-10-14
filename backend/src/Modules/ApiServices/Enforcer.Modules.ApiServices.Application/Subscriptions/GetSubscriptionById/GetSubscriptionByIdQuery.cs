using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.GetSubscriptionById;

public record GetSubscriptionByIdQuery(Guid SubscriptionId) : IQuery<SubscriptionResponse>;