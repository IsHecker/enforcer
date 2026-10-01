namespace Enforcer.Modules.Billings.Domain.Invoices;

public enum InvoiceStatus
{
    Pending,
    Paid,
    Void,
    Refunded,
    PartiallyRefunded
}