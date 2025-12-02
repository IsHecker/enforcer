using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.PromotionalCodeUsages;

public sealed class PromotionalCodeUsage : Entity
{
    public Guid PromoCodeId { get; private set; }
    public Guid ConsumerId { get; private set; }

    public DateTime AppliedAt { get; private set; }
    public long DiscountAmount { get; private set; }

    private PromotionalCodeUsage() { }

    public static PromotionalCodeUsage Create(
        Guid promoCodeId,
        Guid consumerId,
        long discountAmount)
    {
        return new PromotionalCodeUsage
        {
            PromoCodeId = promoCodeId,
            ConsumerId = consumerId,
            AppliedAt = DateTime.UtcNow,
            DiscountAmount = discountAmount
        };
    }
}