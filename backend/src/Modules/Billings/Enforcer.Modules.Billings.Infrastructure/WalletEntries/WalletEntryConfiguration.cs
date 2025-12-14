using Enforcer.Modules.Billings.Domain.WalletEntries;
using Enforcer.Modules.Billings.Domain.Wallets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.Billings.Infrastructure.WalletEntries;

public class WalletEntryConfiguration : IEntityTypeConfiguration<WalletEntry>
{
    public void Configure(EntityTypeBuilder<WalletEntry> builder)
    {
        builder.HasOne<Wallet>()
            .WithMany(i => i.Entries)
            .HasForeignKey(item => item.WalletId);
    }
}