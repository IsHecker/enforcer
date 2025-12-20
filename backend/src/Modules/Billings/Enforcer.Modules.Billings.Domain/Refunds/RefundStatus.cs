namespace Enforcer.Modules.Billings.Domain.Refunds;

public enum RefundStatus
{
    Pending,
    Processing,
    Completed,
    Failed,
    Cancelled
}