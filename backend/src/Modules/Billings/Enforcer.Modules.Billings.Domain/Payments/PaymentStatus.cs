namespace Enforcer.Modules.Billings.Domain.Payments;

public enum PaymentStatus
{
    Pending,
    Processing,
    Succeeded,
    Failed,
    Refunded,
    Overdue,
    Waived,
    PartiallyRefunded,
    Cancelled,
    Expired,
    RequiresAction
}