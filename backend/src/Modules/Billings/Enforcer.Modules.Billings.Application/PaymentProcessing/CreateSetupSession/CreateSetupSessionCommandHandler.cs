using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.Application.PaymentProcessing.CreateSetupSession;

internal sealed class CreateSetupSessionCommandHandler(IStripeService stripeService)
    : ICommandHandler<CreateSetupSessionCommand, CheckoutSessionResponse>
{
    public async Task<Result<CheckoutSessionResponse>> Handle(CreateSetupSessionCommand request, CancellationToken cancellationToken)
    {
        var url = await stripeService.CreateSetupSessionAsync("cus_TQhMgiqIy35WS7", request.ReturnUrl, cancellationToken);

        return new CheckoutSessionResponse(url);
    }
}