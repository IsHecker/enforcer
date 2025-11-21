using Enforcer.Common.Application.Data;
using Enforcer.Common.Infrastructure;
using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Data;
using Enforcer.Modules.Analytics.Domain;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Analytics.Infrastructure.Database;

public sealed class AnalyticsDbContext : DbContext, IUnitOfWork, IAnalyticsDbContext
{
   public AnalyticsDbContext(DbContextOptions<AnalyticsDbContext> options) : base(options) { }

   public DbSet<ApiServiceStat> ApiServiceStats { get; init; }
   public DbSet<EndpointStat> EndpointStats { get; init; }
   public DbSet<SubscriptionStat> SubscriptionStats { get; init; }
   public DbSet<PlanStat> PlanStats { get; init; }
   public DbSet<Rating> Ratings { get; init; }

   protected override void OnModelCreating(ModelBuilder modelBuilder)
   {
      modelBuilder.HasDefaultSchema(Schemas.Analytics);

      modelBuilder.StoreAllEnumsAsNames();

      modelBuilder.ApplyConfigurationsFromAssembly(AssemblyReference.Assembly);
   }
}