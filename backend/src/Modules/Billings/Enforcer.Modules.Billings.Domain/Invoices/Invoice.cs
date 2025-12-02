using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Modules.Billings.Domain.InvoiceLineItems;

namespace Enforcer.Modules.Billings.Domain.Invoices;

public sealed class Invoice : Entity
{
    public Guid ConsumerId { get; private set; }
    public Guid? SubscriptionId { get; private set; }
    public string InvoiceNumber { get; private set; }

    public string Currency { get; private set; }
    public long TaxTotal { get; private set; }
    public long DiscountTotal { get; private set; }
    public long Total { get; private set; }

    public DateTime? BillingPeriodStart { get; private set; }
    public DateTime? BillingPeriodEnd { get; private set; }

    public InvoiceStatus Status { get; private set; }
    public DateTime IssuedAt { get; private set; }
    public DateTime DueAt { get; private set; }
    public DateTime? PaidAt { get; private set; }

    public int PaymentAttempts { get; private set; }

    public string? Notes { get; private set; }

    private List<InvoiceLineItem> _lineItems;

    public IReadOnlyList<InvoiceLineItem> LineItems => _lineItems;

    private Invoice() { }

    public static Invoice Create(
        Guid consumerId,
        string currency,
        Guid? subscriptionId = null,
        DateTime? billingPeriodStart = null,
        DateTime? billingPeriodEnd = null,
        string? notes = null)
    {
        var invoice = new Invoice
        {
            ConsumerId = consumerId,
            SubscriptionId = subscriptionId,
            InvoiceNumber = GenerateInvoiceNumber(),
            Currency = currency,
            BillingPeriodStart = billingPeriodStart,
            BillingPeriodEnd = billingPeriodEnd,
            Status = InvoiceStatus.Pending,
            IssuedAt = DateTime.UtcNow,
            DueAt = DateTime.UtcNow.AddDays(15),
            Notes = notes,
            _lineItems = []
        };

        return invoice;
    }

    public void AddLineItem(InvoiceLineItem item)
    {
        if (Status != InvoiceStatus.Pending)
            throw new InvalidOperationException("Cannot modify finalized invoice");

        _lineItems.Add(item);
        CalculateTotals();
    }

    public void MarkAsPaid()
    {
        if (Status == InvoiceStatus.Paid)
            return;

        Status = InvoiceStatus.Paid;
        PaidAt = DateTime.UtcNow;

        PaymentAttempts++;
    }

    public void MarkAsFailed()
    {
        Status = InvoiceStatus.Failed;
        PaymentAttempts++;
    }

    public void MarkAsRefunded()
    {
        Status = InvoiceStatus.Refunded;
    }

    public void MarkAsPartiallyRefunded()
    {
        Status = InvoiceStatus.PartiallyRefunded;
    }

    private void CalculateTotals()
    {
        Total = _lineItems.Sum(x => x.TotalAmount);

        DiscountTotal = Math.Abs(_lineItems
            .Where(x => x.Type == InvoiceItemType.Discount)
            .Sum(x => x.TotalAmount));

        TaxTotal = _lineItems
            .Where(x => x.Type == InvoiceItemType.Tax)
            .Sum(x => x.TotalAmount);
    }

    private static string GenerateInvoiceNumber() =>
        $"INV-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}";
}