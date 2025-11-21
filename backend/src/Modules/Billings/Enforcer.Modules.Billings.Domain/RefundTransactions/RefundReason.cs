namespace Enforcer.Modules.Billings.Domain.RefundTransactions;

public enum RefundReason
{
    CustomerRequest,
    ServiceIssue,
    DuplicatePayment,
    Overpayment,
    Other
}
