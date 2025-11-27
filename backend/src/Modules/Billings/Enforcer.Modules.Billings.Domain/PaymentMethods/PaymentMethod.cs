using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.Billings.Domain.PaymentMethods;

public sealed class PaymentMethod : Entity
{
    public Guid ConsumerId { get; private set; }

    public PaymentMethodType Type { get; private set; }

    public string StripeCustomerId { get; private set; }
    public string StripePaymentMethodId { get; private set; }

    public string? Fingerprint { get; private set; }
    public string? CardBrand { get; private set; }
    public string CardLast4 { get; private set; }
    public long? CardExpMonth { get; private set; }
    public long? CardExpYear { get; private set; }

    public bool IsDefault { get; private set; }
    public bool IsActive { get; private set; }
    public bool IsVerified { get; private set; }
    public DateTime? VerifiedAt { get; private set; }

    public int FailedAttempts { get; private set; }
    public DateTime? LastFailedAt { get; private set; }
    public string? LastFailureReason { get; private set; }

    public string BillingAddress { get; private set; }

    public DateTime? LastUsedAt { get; private set; }

    private PaymentMethod() { }

    public static PaymentMethod Create(
        Guid consumerId,
        string stripeCustomerId,
        string stripePaymentMethodId,
        PaymentMethodType type,
        string fingerprint,
        string cardLast4,
        string? cardBrand,
        long? cardExpMonth,
        long? cardExpYear,
        string billingAddress)
    {
        return new PaymentMethod
        {
            ConsumerId = consumerId,
            Type = type,
            Fingerprint = fingerprint,
            CardLast4 = cardLast4,
            CardBrand = cardBrand,
            CardExpMonth = cardExpMonth,
            CardExpYear = cardExpYear,
            StripeCustomerId = stripeCustomerId,
            StripePaymentMethodId = stripePaymentMethodId,
            BillingAddress = billingAddress,
            IsActive = true,
            IsVerified = true,
            VerifiedAt = DateTime.UtcNow,
            FailedAttempts = 0
        };
    }

    public Result SetAsDefault(PaymentMethod? oldPaymentMethod = null)
    {
        if (IsDefault)
            return PaymentMethodErrors.IsAlreadyDefault;

        if (oldPaymentMethod is not null)
            oldPaymentMethod.IsDefault = false;

        IsDefault = true;

        return Result.Success;
    }
}