using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.Application.PaymentMethods.CreatePaymentMethod;

internal sealed class CreatePaymentMethodCommandHandler(IStripeGateway stripeService)
    : ICommandHandler<CreatePaymentMethodCommand, CheckoutSessionResponse>
{
    public async Task<Result<CheckoutSessionResponse>> Handle(CreatePaymentMethodCommand request, CancellationToken cancellationToken)
    {
        var url = await stripeService.CreateSetupSessionAsync("cus_TQhMgiqIy35WS7", request.ReturnUrl, cancellationToken);

        return new CheckoutSessionResponse(url);
    }
}