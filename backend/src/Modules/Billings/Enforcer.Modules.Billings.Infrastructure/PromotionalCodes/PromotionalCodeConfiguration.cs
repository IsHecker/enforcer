using Enforcer.Modules.Billings.Domain.PromotionalCodes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.Billings.Infrastructure.PromotionalCodes;

public class PromotionalCodeConfiguration : IEntityTypeConfiguration<PromotionalCode>
{
    public void Configure(EntityTypeBuilder<PromotionalCode> builder)
    {
        builder.HasIndex(pc => pc.Code).IsUnique();
    }
}