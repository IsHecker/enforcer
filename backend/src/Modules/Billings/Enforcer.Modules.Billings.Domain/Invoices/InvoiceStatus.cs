namespace Enforcer.Modules.Billings.Domain.Invoices;

public enum InvoiceStatus
{
    Draft,
    Issued,
    Unpaid,
    Paid,
    PartiallyPaid,
    Overdue,
    Void,
    Refunded,
    PartiallyRefunded,
    WrittenOff
}