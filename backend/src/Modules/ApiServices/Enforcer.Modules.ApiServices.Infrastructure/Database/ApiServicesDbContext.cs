using Enforcer.Common.Application.Data;
using Enforcer.Common.Infrastructure;
using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Domain.ApiKeyBans;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.ApiUsages;
using Enforcer.Modules.ApiServices.Domain.Endpoints;
using Enforcer.Modules.ApiServices.Domain.OpenApiDocumentations;
using Enforcer.Modules.ApiServices.Domain.Plans;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.Database;

public sealed class ApiServicesDbContext : DbContext, IUnitOfWork, IApiServicesDbContext
{
   public ApiServicesDbContext(DbContextOptions<ApiServicesDbContext> options) : base(options) { }

   public DbSet<ApiService> ApiServices { get; init; }
   public DbSet<Endpoint> Endpoints { get; init; }
   public DbSet<OpenApiDocumentation> OpenApiDocumentations { get; init; }

   public DbSet<ApiUsage> ApiUsages { get; init; }

   public DbSet<Subscription> Subscriptions { get; init; }
   public DbSet<Plan> Plans { get; init; }
   public DbSet<PlanFeature> PlanFeatures { get; init; }

   public DbSet<ApiKeyBan> ApiKeyBans { get; init; }

   protected override void OnModelCreating(ModelBuilder modelBuilder)
   {
      modelBuilder.HasDefaultSchema(Schemas.ApiServices);

      modelBuilder.StoreAllEnumsAsNames();

      modelBuilder.ApplyConfigurationsFromAssembly(AssemblyReference.Assembly);
   }
}