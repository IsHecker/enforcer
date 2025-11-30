using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CreateSubscription;

public readonly record struct CreateSubscriptionCommand(
    Guid ConsumerId,
    Guid PlanId,
    Guid ApiServiceId,
    string ReturnUrl
) : ICommand<string>;