using Enforcer.Modules.Billings.Domain.PromotionalCodes;
using Enforcer.Modules.Billings.Domain.PromotionalCodeUsages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.Billings.Infrastructure.PromotionalCodeUsages;

public class PromotionalCodeUsageConfiguration : IEntityTypeConfiguration<PromotionalCodeUsage>
{
    public void Configure(EntityTypeBuilder<PromotionalCodeUsage> builder)
    {
        builder.HasOne<PromotionalCode>()
            .WithMany()
            .HasForeignKey(pc => pc.PromoCodeId);
    }
}