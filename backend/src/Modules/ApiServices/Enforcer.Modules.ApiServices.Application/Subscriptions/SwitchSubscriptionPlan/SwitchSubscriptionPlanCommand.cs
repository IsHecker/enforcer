using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.SwitchSubscriptionPlan;

public readonly record struct SwitchSubscriptionPlanCommand(Guid SubscriptionId, Guid TargetPlanId)
    : ICommand<PaymentIntentResponse>;