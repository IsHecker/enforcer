namespace Enforcer.Modules.Billings.Contracts;

public sealed record PaymentMethodResponse(
    Guid Id,
    string Type,
    string? CardBrand,
    string CardLast4,
    long? CardExpMonth,
    long? CardExpYear,
    bool IsDefault,
    bool IsActive,
    bool IsVerified,
    string BillingAddress,
    DateTime? VerifiedAt = null,
    DateTime? LastFailedAt = null,
    string? LastFailureReason = null,
    DateTime? LastUsedAt = null
);