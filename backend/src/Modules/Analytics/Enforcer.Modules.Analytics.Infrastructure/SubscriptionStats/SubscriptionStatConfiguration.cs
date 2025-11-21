using Enforcer.Modules.Analytics.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.Analytics.Infrastructure.SubscriptionStats;

public class SubscriptionStatConfiguration : IEntityTypeConfiguration<SubscriptionStat>
{
    public void Configure(EntityTypeBuilder<SubscriptionStat> builder)
    {
        builder.Property("_apiCallsUsedThisMonth")
            .HasColumnName("ApiCallsUsedThisMonth");

        builder.Property("_monthUsageDate")
            .HasColumnName("MonthUsageDate");
    }
}