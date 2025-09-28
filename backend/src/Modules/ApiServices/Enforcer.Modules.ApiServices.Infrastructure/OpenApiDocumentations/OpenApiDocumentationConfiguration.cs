using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.ApiServices.Infrastructure.OpenApiDocumentations;

public class OpenApiDocumentationConfiguration : IEntityTypeConfiguration<OpenApiDocumentation>
{
    public void Configure(EntityTypeBuilder<OpenApiDocumentation> builder)
    {
        builder
            .Property(o => o.Documentation)
            .HasColumnType("nvarchar(max)");
    }
}