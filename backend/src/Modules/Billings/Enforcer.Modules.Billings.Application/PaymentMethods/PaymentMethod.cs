using Enforcer.Modules.Billings.Contracts;
using Enforcer.Modules.Billings.Domain.PaymentMethods;

namespace Enforcer.Modules.Billings.Application.PaymentMethods;

public static class PaymentMethods
{
    public static PaymentMethodResponse ToResponse(this PaymentMethod paymentMethod) =>
        new(
            paymentMethod.Id,
            paymentMethod.Type.ToString(),
            paymentMethod.CardBrand,
            paymentMethod.CardLast4,
            paymentMethod.CardExpMonth,
            paymentMethod.CardExpYear,
            paymentMethod.IsDefault,
            paymentMethod.IsActive,
            paymentMethod.IsVerified,
            paymentMethod.BillingAddress,
            paymentMethod.VerifiedAt,
            paymentMethod.LastFailedAt,
            paymentMethod.LastFailureReason,
            paymentMethod.LastUsedAt
        );
}