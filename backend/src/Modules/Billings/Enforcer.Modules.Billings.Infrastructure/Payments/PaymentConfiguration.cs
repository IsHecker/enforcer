using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.Domain.PaymentMethods;
using Enforcer.Modules.Billings.Domain.Payments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.Billings.Infrastructure.Payments;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.Property(x => x.Amount)
            .HasPrecision(18, 2);

        builder.Property(x => x.Currency)
            .HasMaxLength(3);

        builder.Property(x => x.RefundedAmount)
            .HasPrecision(18, 2);

        builder.HasOne<Invoice>()
            .WithMany()
            .HasForeignKey(p => p.InvoiceId);

        builder.HasOne<PaymentMethod>()
            .WithMany()
            .HasForeignKey(p => p.PaymentMethodId);

        builder.HasIndex(x => x.PaymentNumber).IsUnique();
        builder.HasIndex(x => x.PaymentTransactionId).IsUnique();
    }
}