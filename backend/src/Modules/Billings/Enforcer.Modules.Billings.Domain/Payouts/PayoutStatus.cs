namespace Enforcer.Modules.Billings.Domain.Payouts;

public enum PayoutStatus
{
    Scheduled,
    Pending,
    Processing,
    Completed,
    Failed,
    Cancelled,
    OnHold
}
