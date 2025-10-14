using Enforcer.Common.Application.Data;
using Enforcer.Common.Infrastructure;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Enforcer.Modules.ApiServices.Domain.Usages;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.Database;

public class ApiServicesDbContext : DbContext, IUnitOfWork, IApiServicesDbContext
{
   public ApiServicesDbContext(DbContextOptions options) : base(options) { }

   public DbSet<ApiService> ApiServices { get; init; }
   public DbSet<Endpoint> Endpoints { get; init; }
   public DbSet<OpenApiDocumentation> OpenApiDocumentations { get; init; }

   public DbSet<QuotaUsage> QuotaUsages { get; init; }

   public DbSet<Subscription> Subscriptions { get; init; }
   public DbSet<Plan> Plans { get; init; }
   public DbSet<PlanFeature> PlanFeatures { get; init; }

   public DbSet<ApiKeyBlacklist> ApiKeyBlacklist { get; init; }

   protected override void OnModelCreating(ModelBuilder modelBuilder)
   {
      modelBuilder.HasDefaultSchema(Schemas.ApiServices);

      modelBuilder.StoreAllEnumsAsNames();

      modelBuilder.ApplyConfigurationsFromAssembly(AssemblyReference.Assembly);
   }
}