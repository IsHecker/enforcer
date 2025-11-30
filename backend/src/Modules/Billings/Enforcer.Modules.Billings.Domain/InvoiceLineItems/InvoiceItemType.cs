namespace Enforcer.Modules.Billings.Domain.InvoiceLineItems;

public enum InvoiceItemType
{
    Subscription,
    Overage,
    Fee,
    Tax,
    Discount,
    Credit
}