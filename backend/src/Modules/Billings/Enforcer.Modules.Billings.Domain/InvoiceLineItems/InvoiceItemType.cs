namespace Enforcer.Modules.Billings.Domain.InvoiceLineItems;

public enum InvoiceItemType
{
    Subscription,
    Overage,
    Fee,
    Adjustment,
    Tax
}