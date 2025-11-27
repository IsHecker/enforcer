using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.Application.PaymentMethods.CreatePaymentMethod;

public readonly record struct CreatePaymentMethodCommand(
    Guid ConsumerId,
    string ReturnUrl) : ICommand<CheckoutSessionResponse>;