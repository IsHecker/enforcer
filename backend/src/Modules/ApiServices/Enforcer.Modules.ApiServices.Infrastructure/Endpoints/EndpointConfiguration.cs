using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.ApiServices.Infrastructure.Endpoints;

public class EndpointConfiguration : IEntityTypeConfiguration<Endpoint>
{
    public void Configure(EntityTypeBuilder<Endpoint> builder)
    {
        builder
            .HasOne<ApiService>()
            .WithMany()
            .HasForeignKey(p => p.ApiServiceId);

        builder
            .HasOne<Plan>()
            .WithMany()
            .HasForeignKey(p => p.PlanId)
            .OnDelete(DeleteBehavior.NoAction);

        builder
            .HasIndex(p => new { p.HTTPMethod, p.PublicPath })
            .IsUnique();
    }
}