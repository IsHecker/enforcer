using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.PaymentMethods;

namespace Enforcer.Modules.Billings.Application.PaymentMethods.RemovePaymentMethod;

internal sealed class RemovePaymentMethodCommandHandler(
    IPaymentMethodRepository paymentMethodRepository,
    IStripeGateway stripeService)
    : ICommandHandler<RemovePaymentMethodCommand>
{
    public async Task<Result> Handle(RemovePaymentMethodCommand request, CancellationToken cancellationToken)
    {
        var paymentMethod = await paymentMethodRepository.GetByIdAsync(request.PaymentMethodId, cancellationToken);

        if (paymentMethod is null)
            return PaymentMethodErrors.NotFound(request.PaymentMethodId);

        await stripeService.RemovePaymentMethodAsync(paymentMethod.StripePaymentMethodId, cancellationToken);

        paymentMethodRepository.Delete(paymentMethod);

        return Result.Success;
    }
}