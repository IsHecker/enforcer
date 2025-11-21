using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.CreditNotes;

public class CreditNote : Entity
{
    public Guid CreditNoteId { get; private set; }
    public string CreditNoteNumber { get; private set; }
    public Guid? InvoiceId { get; private set; }
    public Guid ConsumerId { get; private set; }

    public decimal Amount { get; private set; }
    public string Currency { get; private set; }

    public CreditNoteReason Reason { get; private set; }
    public string Description { get; private set; }

    public CreditNoteStatus Status { get; private set; }
    public DateTime? ExpiresAt { get; private set; }

    public string[] AppliedToInvoices { get; private set; }

    private CreditNote() { }
}