using Enforcer.Common.Application.Data;
using Enforcer.Common.Infrastructure;
using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Billings.Application.Abstractions.Data;
using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.Domain.PaymentMethods;
using Enforcer.Modules.Billings.Domain.Payments;
using Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.ProcessedStripeEvents;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Infrastructure.Database;

public sealed class BillingsDbContext : DbContext, IUnitOfWork, IBillingsDbContext
{
   public BillingsDbContext(DbContextOptions<BillingsDbContext> options) : base(options) { }

   public DbSet<PaymentMethod> PaymentMethods { get; init; }
   public DbSet<Payment> Payments { get; init; }
   public DbSet<Invoice> Invoices { get; init; }

   public DbSet<ProcessedStripeEvent> ProcessedStripeEvents { get; init; }

   protected override void OnModelCreating(ModelBuilder modelBuilder)
   {
      modelBuilder.HasDefaultSchema(Schemas.Billings);

      modelBuilder.StoreAllEnumsAsNames();

      modelBuilder.ApplyConfigurationsFromAssembly(AssemblyReference.Assembly);
   }
}