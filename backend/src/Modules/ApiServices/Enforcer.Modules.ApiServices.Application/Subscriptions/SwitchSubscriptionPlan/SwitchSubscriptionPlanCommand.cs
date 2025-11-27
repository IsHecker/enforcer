namespace Enforcer.Modules.ApiServices.Application.Subscriptions.SwitchSubscriptionPlan;

using Enforcer.Common.Application.Messaging;

public readonly record struct SwitchSubscriptionPlanCommand(Guid SubscriptionId, Guid TargetPlanId) : ICommand;