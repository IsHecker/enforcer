using Enforcer.Modules.ApiServices.Domain.Usages;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.ApiServices.Infrastructure.ApiKeyBans;

public class ApiKeyBansConfiguration : IEntityTypeConfiguration<ApiKeyBan>
{
    public void Configure(EntityTypeBuilder<ApiKeyBan> builder)
    {
        builder.HasIndex(b => b.ApiKey);
    }
}