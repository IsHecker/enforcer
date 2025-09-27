using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.ApiServices.Infrastructure.ApiServices;

public class ApiServiceConfiguration : IEntityTypeConfiguration<ApiService>
{
    public void Configure(EntityTypeBuilder<ApiService> builder)
    {
        throw new NotImplementedException();
    }
}