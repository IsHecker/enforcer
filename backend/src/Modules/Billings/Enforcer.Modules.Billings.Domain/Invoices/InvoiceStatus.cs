namespace Enforcer.Modules.Billings.Domain.Invoices;

public enum InvoiceStatus
{
    Failed,
    Paid,
    Pending,
    Refunded,
    PartiallyRefunded
}