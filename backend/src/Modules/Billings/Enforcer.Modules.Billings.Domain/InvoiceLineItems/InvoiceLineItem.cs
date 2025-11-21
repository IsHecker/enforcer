using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.InvoiceLineItems;

public sealed class InvoiceLineItem : Entity
{
    public Guid InvoiceId { get; private set; }

    public string Description { get; private set; }
    public InvoiceItemType Type { get; private set; }

    public decimal Quantity { get; private set; }
    public long UnitPrice { get; private set; }
    public long TotalAmount { get; private set; }

    public DateTime? PeriodStart { get; private set; }
    public DateTime? PeriodEnd { get; private set; }

    private InvoiceLineItem() { }
}