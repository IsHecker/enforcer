using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.RevenueShareAgreements;

public class RevenueShareAgreement : Entity
{
    public Guid CreatorId { get; private set; }
    public Guid? ApiServiceId { get; private set; }

    public decimal PlatformFeePercentage { get; private set; }
    public decimal CreatorSharePercentage { get; private set; }
    public RevenueShareTier[]? TierStructure { get; private set; }

    public DateTime EffectiveFrom { get; private set; }
    public DateTime? EffectiveTo { get; private set; }
    public bool IsActive { get; private set; }

    private RevenueShareAgreement() { }
}