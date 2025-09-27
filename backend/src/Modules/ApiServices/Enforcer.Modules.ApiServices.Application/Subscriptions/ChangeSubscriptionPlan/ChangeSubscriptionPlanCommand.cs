namespace Enforcer.Modules.ApiServices.Application.Subscriptions.ChangeSubscriptionPlan;

using Enforcer.Common.Application.Messaging;

public record ChangeSubscriptionPlanCommand(Guid SubscriptionId, Guid TargetPlanId) : ICommand;
