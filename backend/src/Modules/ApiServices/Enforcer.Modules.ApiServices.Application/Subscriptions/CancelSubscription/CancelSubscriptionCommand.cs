using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CancelSubscription;

public readonly record struct CancelSubscriptionCommand(Guid SubscriptionId, Guid ConsumerId, bool IsImmediate)
    : ICommand;