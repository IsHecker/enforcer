using Enforcer.Common.Application.Data;
using Enforcer.Modules.Billings.Domain.PaymentMethods;

namespace Enforcer.Modules.Billings.Application.Abstractions.Repositories;

public interface IPaymentMethodRepository : IRepository<PaymentMethod>
{
    Task<int> GetCountByConsumerIdAsync(Guid consumerId, CancellationToken ct = default);
}