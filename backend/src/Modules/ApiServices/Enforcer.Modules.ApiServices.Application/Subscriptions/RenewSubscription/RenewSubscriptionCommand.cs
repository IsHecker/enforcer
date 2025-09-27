using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.RenewSubscription;

public record RenewSubscriptionCommand(Guid SubscriptionId) : ICommand;