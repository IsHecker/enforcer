using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.Invoices;

public sealed class LineItem : Entity
{
    public Guid InvoiceId { get; private set; }
    public LineItemType Type { get; private set; }
    public string Description { get; private set; }
    public int Quantity { get; private set; }
    public long UnitPrice { get; private set; }
    public long Amount { get; private set; }
    public DateTime? PeriodStart { get; private set; }
    public DateTime? PeriodEnd { get; private set; }

    private LineItem() { }

    public static LineItem Create(
        LineItemType type,
        string description,
        long unitPrice,
        int quantity = 1,
        DateTime? periodStart = null,
        DateTime? periodEnd = null)
    {
        return new LineItem
        {
            Type = type,
            Description = description,
            Quantity = quantity,
            UnitPrice = unitPrice,
            Amount = quantity * unitPrice,
            PeriodStart = periodStart,
            PeriodEnd = periodEnd
        };
    }
}