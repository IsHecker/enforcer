namespace Enforcer.Modules.Billings.Domain.Payments;

public enum PaymentStatus
{
    Succeeded,
    Failed,
    Refunded,
    PartiallyRefunded
}