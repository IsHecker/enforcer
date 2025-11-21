using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Plans;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.ApiServices.Infrastructure.Plans;

internal sealed class PlanConfiguration : IEntityTypeConfiguration<Plan>
{
    public void Configure(EntityTypeBuilder<Plan> builder)
    {
        builder
            .HasOne<ApiService>()
            .WithMany()
            .HasForeignKey(p => p.ApiServiceId);

        builder
            .HasOne(p => p.Features)
            .WithOne()
            .HasForeignKey<Plan>(p => p.FeaturesId);

        builder.HasIndex(p => new { p.ApiServiceId, p.TierLevel })
            .IsUnique();
    }
}