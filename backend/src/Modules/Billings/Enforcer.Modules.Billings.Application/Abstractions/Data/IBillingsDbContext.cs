using Enforcer.Modules.Billings.Domain.InvoiceLineItems;
using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.Domain.PaymentMethods;
using Enforcer.Modules.Billings.Domain.Payments;
using Enforcer.Modules.Billings.Domain.Payouts;
using Enforcer.Modules.Billings.Domain.PromotionalCodes;
using Enforcer.Modules.Billings.Domain.PromotionalCodeUsages;
using Enforcer.Modules.Billings.Domain.Refunds;
using Enforcer.Modules.Billings.Domain.WalletEntries;
using Enforcer.Modules.Billings.Domain.Wallets;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Application.Abstractions.Data;

public interface IBillingsDbContext
{
    DbSet<PaymentMethod> PaymentMethods { get; }
    DbSet<Payment> Payments { get; }
    DbSet<Invoice> Invoices { get; }

    DbSet<InvoiceLineItem> InvoiceLineItems { get; init; }
    DbSet<Refund> Refunds { get; init; }
    DbSet<PromotionalCode> PromotionalCodes { get; init; }
    DbSet<PromotionalCodeUsage> PromotionalCodeUsages { get; init; }

    DbSet<Wallet> Wallets { get; init; }
    DbSet<WalletEntry> WalletEntries { get; init; }
    DbSet<Payout> Payouts { get; init; }
}