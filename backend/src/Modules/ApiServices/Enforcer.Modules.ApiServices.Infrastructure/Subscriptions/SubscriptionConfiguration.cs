using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.ApiServices.Infrastructure.Subscriptions;

public class SubscriptionConfiguration : IEntityTypeConfiguration<Subscription>
{
    public void Configure(EntityTypeBuilder<Subscription> builder)
    {
        builder
            .HasOne(s => s.Plan)
            .WithMany()
            .HasForeignKey(s => s.PlanId)
            .OnDelete(DeleteBehavior.NoAction);

        builder
            .HasOne(s => s.ApiService)
            .WithMany()
            .HasForeignKey(s => s.ApiServiceId);

        builder.HasIndex(s => s.ApiKey).IsUnique();
        builder.HasIndex(s => new { s.ConsumerId, s.PlanId })
            .IsUnique();
    }
}