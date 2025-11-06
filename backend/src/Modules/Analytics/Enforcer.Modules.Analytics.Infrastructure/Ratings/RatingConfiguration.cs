using Enforcer.Modules.Analytics.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.Analytics.Infrastructure.Ratings;

public class RatingConfiguration : IEntityTypeConfiguration<Rating>
{
    public void Configure(EntityTypeBuilder<Rating> builder)
    {
        builder.HasIndex(r => new { r.ConsumerId, r.ApiServiceId }).IsUnique();
    }
}