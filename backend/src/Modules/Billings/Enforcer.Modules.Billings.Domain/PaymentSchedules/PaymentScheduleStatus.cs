namespace Enforcer.Modules.Billings.Domain.PaymentSchedules;

public enum PaymentScheduleStatus
{
    Scheduled,
    Processing,
    Completed,
    Failed,
    Cancelled
}
