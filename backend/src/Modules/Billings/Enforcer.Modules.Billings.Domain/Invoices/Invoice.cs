using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.Billings.Domain.Invoices;

public sealed class Invoice : Entity
{
    public Guid ConsumerId { get; private set; }
    public Guid? ReferenceId { get; private set; }
    public string InvoiceNumber { get; private set; } = null!;
    public string Currency { get; private set; } = null!;

    public long Subtotal { get; private set; }
    public long DiscountTotal { get; private set; }
    public long Total { get; private set; }

    public DateTime? PeriodStart { get; private set; }
    public DateTime? PeriodEnd { get; private set; }

    public InvoiceStatus Status { get; private set; }
    public DateTime IssuedAt { get; private set; }
    public DateTime? PaidAt { get; private set; }
    public int PaymentAttempts { get; private set; }

    public string? Notes { get; private set; }

    private List<LineItem> _lineItems = null!;
    public IReadOnlyList<LineItem> LineItems => _lineItems;

    private Invoice() { }

    public static Invoice Create(
        Guid consumerId,
        string currency,
        List<LineItem> lineItems,
        Guid? referenceId = null,
        DateTime? periodStart = null,
        DateTime? periodEnd = null,
        string? notes = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(currency);
        ArgumentNullException.ThrowIfNull(lineItems);

        if (lineItems.Count == 0)
            throw new ArgumentException("Invoice must have at least one line item.");

        var invoice = new Invoice
        {
            ConsumerId = consumerId,
            ReferenceId = referenceId,
            InvoiceNumber = GenerateInvoiceNumber(),
            Currency = currency,
            PeriodStart = periodStart,
            PeriodEnd = periodEnd,
            Status = InvoiceStatus.Pending,
            IssuedAt = DateTime.UtcNow,
            Notes = notes,
            _lineItems = lineItems
        };

        invoice.RecalculateTotals();
        return invoice;
    }

    public Result Pay()
    {
        if (Status != InvoiceStatus.Pending)
            return InvoiceErrors.CannotTransition(Status, InvoiceStatus.Paid);

        Status = InvoiceStatus.Paid;
        PaidAt = DateTime.UtcNow;
        PaymentAttempts++;
        return Result.Success;
    }

    public Result Void()
    {
        if (Status != InvoiceStatus.Pending)
            return InvoiceErrors.CannotTransition(Status, InvoiceStatus.Void);

        Status = InvoiceStatus.Void;
        return Result.Success;
    }

    public Result Refund(long amount)
    {
        if (Status != InvoiceStatus.Paid)
            return InvoiceErrors.CannotTransition(Status, InvoiceStatus.Refunded);

        Status = amount >= Total
            ? InvoiceStatus.Refunded
            : InvoiceStatus.PartiallyRefunded;

        return Result.Success;
    }

    public void RecordFailedAttempt() => PaymentAttempts++;

    private void RecalculateTotals()
    {
        Subtotal = _lineItems
            .Where(x => x.Type != LineItemType.Discount
                     && x.Type != LineItemType.Tax
                     && x.Type != LineItemType.Credit)
            .Sum(x => x.Amount);

        DiscountTotal = Math.Abs(_lineItems
            .Where(x => x.Type == LineItemType.Discount)
            .Sum(x => x.Amount));

        Total = _lineItems.Sum(x => x.Amount);
    }

    private static string GenerateInvoiceNumber() =>
        $"INV-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}";
}