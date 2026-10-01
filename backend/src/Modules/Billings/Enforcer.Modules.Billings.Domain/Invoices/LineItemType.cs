namespace Enforcer.Modules.Billings.Domain.Invoices;

public enum LineItemType
{
    Subscription,
    Overage,
    Credit,
    Discount,
    Fee,
    Tax
}