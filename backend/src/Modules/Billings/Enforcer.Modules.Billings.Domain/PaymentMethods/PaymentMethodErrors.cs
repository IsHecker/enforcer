using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.Billings.Domain.PaymentMethods;

public static class PaymentMethodErrors
{
    public static Error NotFound(Guid paymentMethodId) =>
        Error.NotFound(
            "PaymentMethod.NotFound",
            $"The payment method with Id '{paymentMethodId}' was not found.");


    public static readonly Error NoDefaultPaymentMethod =
        Error.NotFound(
            "PaymentMethod.NoDefaultPaymentMethod",
            $"A default payment method is not found on this consumer.");

    public static readonly Error IsAlreadyDefault =
        Error.Validation(
            "PaymentMethod.IsAlreadyDefault",
            $"This card is already set as default.");
}