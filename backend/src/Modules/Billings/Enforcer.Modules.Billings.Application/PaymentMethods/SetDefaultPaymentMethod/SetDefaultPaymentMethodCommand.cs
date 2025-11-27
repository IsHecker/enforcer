using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.Billings.Application.PaymentMethods.SetDefaultPaymentMethod;

public readonly record struct SetDefaultPaymentMethodCommand(Guid ConsumerId, Guid PaymentMethodId) : ICommand;