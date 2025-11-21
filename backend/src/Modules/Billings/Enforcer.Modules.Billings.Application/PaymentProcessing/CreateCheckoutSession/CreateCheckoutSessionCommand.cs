using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.Application.PaymentProcessing.CreateCheckoutSession;

public readonly record struct CreateCheckoutSessionCommand(
    Guid ConsumerId,
    Guid PlanId,
    string ReturnUrl) : ICommand<CheckoutSessionResponse>;