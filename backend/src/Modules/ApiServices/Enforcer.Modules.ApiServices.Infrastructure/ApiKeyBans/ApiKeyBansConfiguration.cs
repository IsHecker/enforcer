using Enforcer.Modules.ApiServices.Domain.ApiKeyBans;
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