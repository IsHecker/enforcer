using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.PaymentMethods;

namespace Enforcer.Modules.Billings.Application.PaymentMethods.SetDefaultPaymentMethod;

internal sealed class SetDefaultPaymentMethodCommandHandler(IPaymentMethodRepository paymentMethodRepository)
    : ICommandHandler<SetDefaultPaymentMethodCommand>
{
    public async Task<Result> Handle(SetDefaultPaymentMethodCommand request, CancellationToken cancellationToken)
    {
        var paymentMethod = await paymentMethodRepository.GetByIdAsync(request.PaymentMethodId, cancellationToken);

        if (paymentMethod is null)
            return PaymentMethodErrors.NotFound(request.PaymentMethodId);

        var oldPaymentMethod = await paymentMethodRepository.GetDefaultAsync(request.ConsumerId, cancellationToken);

        var result = paymentMethod.SetAsDefault(oldPaymentMethod);

        if (result.IsFailure)
            return result.Error;

        if (oldPaymentMethod is not null)
            paymentMethodRepository.Update(oldPaymentMethod);

        paymentMethodRepository.Update(paymentMethod);

        return Result.Success;
    }
}