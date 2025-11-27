using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Data;
using Enforcer.Modules.Billings.Contracts;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Application.PaymentMethods.ListConsumerPaymentMethods;

internal sealed class ListConsumerPaymentMethodsQueryHandler(IBillingsDbContext context)
    : IQueryHandler<ListConsumerPaymentMethodsQuery, IEnumerable<PaymentMethodResponse>>
{
    public async Task<Result<IEnumerable<PaymentMethodResponse>>> Handle(
        ListConsumerPaymentMethodsQuery request,
        CancellationToken cancellationToken)
    {
        var paymentMethods = context.PaymentMethods
            .AsNoTracking()
            .Where(pm => pm.ConsumerId == request.ConsumerId)
            .Select(pm => pm.ToResponse());

        return paymentMethods.ToResult<IEnumerable<PaymentMethodResponse>>();
    }
}