using Enforcer.Common.Infrastructure;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.Database;

public class ApiServicesDbContext : DbContext, IUnitOfWork, IApiServicesDbContext
{
   public ApiServicesDbContext(DbContextOptions options) : base(options) { }

   public DbSet<ApiService> ApiServices { get; }
   public DbSet<Endpoint> Endpoints { get; }
   public DbSet<OpenApiDocumentation> OpenApiDocumentations { get; }

   public DbSet<Subscription> Subscriptions { get; }
   public DbSet<Plan> Plans { get; }
   public DbSet<PlanFeature> PlanFeatures { get; }

   protected override void OnModelCreating(ModelBuilder modelBuilder)
   {
      modelBuilder.HasDefaultSchema(Schemas.ApiServices);

      modelBuilder.ApplyConfigurationsFromAssembly(AssemblyReference.Assembly);
   }
}