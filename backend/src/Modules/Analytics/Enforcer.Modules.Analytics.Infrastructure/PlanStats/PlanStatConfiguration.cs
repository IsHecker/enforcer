using Enforcer.Modules.Analytics.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.Analytics.Infrastructure.PlanStats;

public class PlanStatConfiguration : IEntityTypeConfiguration<PlanStat>
{
    public void Configure(EntityTypeBuilder<PlanStat> builder)
    {
        builder.Property("_cancellationsThisMonth")
            .HasColumnName("CancellationsThisMonth");

        builder.Property("_monthTrackingDate")
            .HasColumnName("MonthTrackingDate");
    }
}