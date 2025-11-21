using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.Invoices;

public sealed class Invoice : Entity
{
    public Guid ConsumerId { get; private set; }
    public Guid SubscriptionId { get; private set; }
    public string InvoiceNumber { get; private set; }

    public string Currency { get; private set; }
    public long TaxTotal { get; private set; }
    public long Total { get; private set; }

    public DateTime? BillingPeriodStart { get; private set; }
    public DateTime? BillingPeriodEnd { get; private set; }

    public InvoiceStatus Status { get; private set; }
    public DateTime IssuedAt { get; private set; }
    public DateTime DueAt { get; private set; }
    public DateTime? PaidAt { get; private set; }
    public DateTime? VoidedAt { get; private set; }
    public string? VoidReason { get; private set; }

    public int PaymentAttempts { get; private set; }

    public string? Notes { get; private set; }

    private Invoice() { }

    public static Invoice Create(
        string currency,
        InvoiceStatus status = InvoiceStatus.Unpaid,
        DateTime? billingPeriodStart = null,
        DateTime? billingPeriodEnd = null,
        string? notes = null)
    {

        return new Invoice
        {
            InvoiceNumber = $"INV-{Guid.NewGuid().ToString()[..10].ToUpper()}",
            Currency = currency,
            BillingPeriodStart = billingPeriodStart,
            BillingPeriodEnd = billingPeriodEnd,
            Status = status,
            IssuedAt = DateTime.UtcNow,
            DueAt = DateTime.UtcNow.AddDays(15),
            Notes = notes
        };
    }

    public void MarkAsPaid()
    {
        if (Status == InvoiceStatus.Paid)
            return;

        Status = InvoiceStatus.Paid;
        PaidAt = DateTime.UtcNow;
    }
}