using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.Application.PaymentMethods.CreatePaymentMethod;

internal sealed class CreatePaymentMethodCommandHandler(IStripeGateway stripeService)
    : ICommandHandler<CreatePaymentMethodCommand, SessionResponse>
{
    public async Task<Result<SessionResponse>> Handle(CreatePaymentMethodCommand request, CancellationToken cancellationToken)
    {
        var url = await stripeService.CreateSetupSessionAsync(SharedData.CustomerId, request.ReturnUrl, cancellationToken);

        return new SessionResponse(url);
    }
}