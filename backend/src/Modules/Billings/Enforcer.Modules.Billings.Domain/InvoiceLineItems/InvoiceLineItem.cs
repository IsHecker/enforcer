using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.InvoiceLineItems;

public sealed class InvoiceLineItem : Entity
{
    public Guid InvoiceId { get; private set; }

    public InvoiceItemType Type { get; private set; }
    public string Description { get; private set; }

    public long Quantity { get; private set; }
    public long UnitPrice { get; private set; }
    public long TotalAmount { get; private set; }

    public DateTime? PeriodStart { get; private set; }
    public DateTime? PeriodEnd { get; private set; }

    private InvoiceLineItem() { }

    public static InvoiceLineItem Create(
        InvoiceItemType type,
        string description,
        int quantity,
        long unitPrice,
        DateTime? periodStart = null,
        DateTime? periodEnd = null)
    {
        return new InvoiceLineItem
        {
            Type = type,
            Description = description,
            Quantity = quantity,
            UnitPrice = unitPrice,
            TotalAmount = quantity * unitPrice,
            PeriodStart = periodStart,
            PeriodEnd = periodEnd
        };
    }
}