using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.Billings.Application.PaymentMethods.RemovePaymentMethod;

public readonly record struct RemovePaymentMethodCommand(Guid PaymentMethodId) : ICommand;