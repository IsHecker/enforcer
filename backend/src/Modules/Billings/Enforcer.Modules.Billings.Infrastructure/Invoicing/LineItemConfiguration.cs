using Enforcer.Modules.Billings.Domain.Invoices;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.Billings.Infrastructure.Invoicing;

internal sealed class LineItemConfiguration : IEntityTypeConfiguration<LineItem>
{
    public void Configure(EntityTypeBuilder<LineItem> builder)
    {
        builder.ToTable("InvoiceLineItems", "Billings");

        builder.HasOne<Invoice>()
            .WithMany(i => i.LineItems)
            .HasForeignKey(item => item.InvoiceId);
    }
}