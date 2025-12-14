using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CreateSubscription;

public readonly record struct CreateSubscriptionCommand(
    Guid ConsumerId,
    Guid PlanId,
    Guid ApiServiceId,
    string Code,
    string ReturnUrl) : ICommand<CheckoutSessionResponse>;