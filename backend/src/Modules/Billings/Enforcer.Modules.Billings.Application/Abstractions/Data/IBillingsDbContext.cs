using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.Domain.PaymentMethods;
using Enforcer.Modules.Billings.Domain.Payments;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Application.Abstractions.Data;

public interface IBillingsDbContext
{
    DbSet<PaymentMethod> PaymentMethods { get; }
    DbSet<Payment> Payments { get; }
    DbSet<Invoice> Invoices { get; }
}