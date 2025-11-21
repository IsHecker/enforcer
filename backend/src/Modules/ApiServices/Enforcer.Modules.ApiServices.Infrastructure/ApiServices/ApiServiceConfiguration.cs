using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.OpenApiDocumentations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.ApiServices.Infrastructure.ApiServices;

internal sealed class ApiServiceConfiguration : IEntityTypeConfiguration<ApiService>
{
    public void Configure(EntityTypeBuilder<ApiService> builder)
    {
        builder
            .HasOne<OpenApiDocumentation>()
            .WithOne()
            .HasForeignKey<ApiService>(p => p.ApiDocId);

        builder.HasIndex(p => p.ServiceKey).IsUnique();
        builder.HasIndex(p => p.Name).IsUnique();
    }
}