using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.PromotionalCodes;

public class PromotionalCode : Entity
{
    public string Code { get; private set; }

    public PromotionalCodeDiscountType DiscountType { get; private set; }
    public decimal DiscountValue { get; private set; }

    public Guid[] ApplicableToPlans { get; private set; }
    public Guid[] ApplicableToProducts { get; private set; }

    public int? MaxUses { get; private set; }
    public int UsedCount { get; private set; } = 0;
    public int? MaxUsesPerCustomer { get; private set; } = 1;

    public int? DurationInMonths { get; private set; }

    public DateTime ValidFrom { get; private set; }
    public DateTime? ValidUntil { get; private set; }
    public bool IsActive { get; private set; }

    public Guid CreatedBy { get; private set; }

    private PromotionalCode() { }
}
