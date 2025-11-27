using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.Application.PaymentMethods.ListConsumerPaymentMethods;

public readonly record struct ListConsumerPaymentMethodsQuery(Guid ConsumerId)
    : IQuery<IEnumerable<PaymentMethodResponse>>;