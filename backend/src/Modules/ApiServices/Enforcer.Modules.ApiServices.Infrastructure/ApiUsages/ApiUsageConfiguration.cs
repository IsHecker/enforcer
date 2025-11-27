using Enforcer.Modules.ApiServices.Domain.ApiUsages;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.ApiServices.Infrastructure.ApiUsages;

internal sealed class ApiUsageConfiguration : IEntityTypeConfiguration<ApiUsage>
{
    public void Configure(EntityTypeBuilder<ApiUsage> builder)
    {
        builder.HasOne<Subscription>()
            .WithOne(sub => sub.ApiUsage)
            .HasForeignKey<ApiUsage>(qu => qu.SubscriptionId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}