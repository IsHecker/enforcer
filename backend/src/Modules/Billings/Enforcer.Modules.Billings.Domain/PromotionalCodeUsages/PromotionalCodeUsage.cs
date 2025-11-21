using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.PromotionalCodeUsages;

public class PromotionalCodeUsage : Entity
{
    public Guid PromoCodeId { get; private set; }
    public Guid SubscriptionId { get; private set; }
    public Guid ConsumerId { get; private set; }

    public DateTime AppliedAt { get; private set; }
    public decimal DiscountAmount { get; private set; }
    public int RemainingCycles { get; private set; }

    private PromotionalCodeUsage() { }
}