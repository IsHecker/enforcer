using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CreateSubscription;

public sealed record CreateSubscriptionCommand(
    Guid ConsumerId,
    Guid PlanId,
    Guid ApiServiceId
) : ICommand<Guid>;