using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.PaymentMethods;
using Enforcer.Modules.Billings.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentMethods;

public class PaymentMethodRepository(BillingsDbContext context)
    : Repository<PaymentMethod>(context), IPaymentMethodRepository
{
    public Task<int> GetCountByConsumerIdAsync(Guid consumerId, CancellationToken cancellationToken = default)
    {
        return context.PaymentMethods
            .CountAsync(pm => pm.ConsumerId == consumerId, cancellationToken);
    }

    public Task<PaymentMethod?> GetByStripePaymentMethodId(string stripePaymentMethodId, CancellationToken cancellationToken = default)
    {
        return context.PaymentMethods
            .AsNoTracking()
            .FirstOrDefaultAsync(pm => pm.StripePaymentMethodId == stripePaymentMethodId, cancellationToken);
    }

    public Task<PaymentMethod?> GetDefaultAsync(Guid consumerId, CancellationToken cancellationToken = default)
    {
        return context.PaymentMethods
            .AsNoTracking()
            .FirstOrDefaultAsync(pm => pm.ConsumerId == consumerId && pm.IsDefault, cancellationToken);
    }
}