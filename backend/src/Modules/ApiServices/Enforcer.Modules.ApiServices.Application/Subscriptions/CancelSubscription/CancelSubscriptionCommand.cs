using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CancelSubscription;

public record CancelSubscriptionCommand(Guid SubscriptionId, Guid ConsumerId) : ICommand;