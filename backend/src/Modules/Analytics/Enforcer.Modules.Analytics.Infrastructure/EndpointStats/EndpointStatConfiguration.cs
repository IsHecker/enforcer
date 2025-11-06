using System.Data;
using Enforcer.Modules.Analytics.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.Analytics.Infrastructure.EndpointStats;

public class EndpointStatConfiguration : IEntityTypeConfiguration<EndpointStat>
{
    public void Configure(EntityTypeBuilder<EndpointStat> builder)
    {
        builder.Property("_dailyCallCount")
            .HasColumnName("DailyCallCount");
    }
}