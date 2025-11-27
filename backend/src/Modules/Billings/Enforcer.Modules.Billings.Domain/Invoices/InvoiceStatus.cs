namespace Enforcer.Modules.Billings.Domain.Invoices;

public enum InvoiceStatus
{
    Draft,
    Issued,
    Failed,
    Unpaid,
    Paid,
    PartiallyPaid,
    Pending,
    Overdue,
    Void,
    Refunded,
    PartiallyRefunded,
    WrittenOff
}