using Enforcer.Modules.Billings.Domain.PaymentMethods;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentMethods;

internal sealed class PaymentMethodConfiguration : IEntityTypeConfiguration<PaymentMethod>
{
    public void Configure(EntityTypeBuilder<PaymentMethod> builder)
    {
        builder.HasIndex(pm => pm.ConsumerId);
        builder.HasIndex(pm => pm.StripePaymentMethodId).IsUnique();
        builder.HasIndex(pm => new { pm.ConsumerId, pm.Fingerprint }).IsUnique();
    }
}