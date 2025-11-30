using Enforcer.Common.Application.Data;
using Enforcer.Modules.Billings.Domain.PaymentMethods;

namespace Enforcer.Modules.Billings.Application.Abstractions.Repositories;

public interface IPaymentMethodRepository : IRepository<PaymentMethod>
{
    Task<int> GetCountByConsumerIdAsync(Guid consumerId, CancellationToken cancellationToken = default);
    Task<PaymentMethod?> GetByStripePaymentMethodId(string stripePaymentMethodId, CancellationToken cancellationToken = default);
    Task<PaymentMethod?> GetDefaultAsync(Guid consumerId, CancellationToken cancellationToken = default);
}