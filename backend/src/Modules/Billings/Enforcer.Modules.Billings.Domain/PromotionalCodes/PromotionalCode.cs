using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.PromotionalCodes;

public sealed class PromotionalCode : Entity
{
    public string Code { get; private set; }

    public PromotionalCodeDiscountType Type { get; private set; }
    public int Value { get; private set; }

    // public Guid[] ApplicableToPlans { get; private set; }
    // public Guid[] ApplicableToProducts { get; private set; }

    public int? MaxUses { get; private set; }
    public int? MaxUsesPerUser { get; private set; }
    public int UsedCount { get; private set; }

    public DateTime ValidFrom { get; private set; }
    public DateTime? ValidUntil { get; private set; }
    public bool IsActive { get; private set; }

    public Guid CreatedBy { get; private set; }

    private PromotionalCode() { }

    public static PromotionalCode Create(
        string code,
        PromotionalCodeDiscountType type,
        int value,
        int? maxUses,
        int? maxUsesPerUser,
        DateTime validFrom,
        DateTime? validUntil,
        Guid createdBy)
    {
        return new PromotionalCode
        {
            Code = code,
            Type = type,
            Value = value,
            MaxUses = maxUses,
            MaxUsesPerUser = maxUsesPerUser,
            UsedCount = 0,
            ValidFrom = validFrom,
            ValidUntil = validUntil,
            IsActive = true,
            CreatedBy = createdBy
        };
    }

    public bool IsCurrentlyValid()
    {
        var now = DateTime.UtcNow;
        return IsActive
            && now >= ValidFrom
            && (ValidUntil == null || now <= ValidUntil);
    }

    public bool HasReachedMaxUses()
    {
        return MaxUses.HasValue && UsedCount >= MaxUses.Value;
    }

    public bool HasExceededPerUserLimit(int userUsageCount)
    {
        return userUsageCount >= MaxUsesPerUser!.Value;
    }

    public long CalculateDiscount(long totalAmount)
    {
        var discount = Type == PromotionalCodeDiscountType.Percentage
            ? (long)Math.Ceiling(totalAmount * (Value / 100m))
            : Value;

        return Math.Min(discount, totalAmount);
    }

    public void IncrementUsageCount() => UsedCount++;
}