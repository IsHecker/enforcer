using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.RenewSubscription;

public readonly record struct RenewSubscriptionCommand(Guid SubscriptionId) : ICommand<PaymentIntentResponse>;