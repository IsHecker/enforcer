namespace Enforcer.Modules.Billings.Domain.RevenueShareAgreements;

public class RevenueShareTier
{
    public decimal MinRevenue { get; set; }
    public decimal MaxRevenue { get; set; }
    public decimal PlatformFeePercentage { get; set; }
}
