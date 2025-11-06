namespace Enforcer.Modules.ApiServices.Application.Subscriptions.ChangeSubscriptionPlan;

using Enforcer.Common.Application.Messaging;

public readonly record struct ChangeSubscriptionPlanCommand(Guid SubscriptionId, Guid TargetPlanId) : ICommand;