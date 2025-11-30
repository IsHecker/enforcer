namespace Enforcer.Modules.Billings.Domain.RefundTransactions;

public enum RefundStatus
{
    Pending,
    Processing,
    Completed,
    Failed,
    Cancelled
}