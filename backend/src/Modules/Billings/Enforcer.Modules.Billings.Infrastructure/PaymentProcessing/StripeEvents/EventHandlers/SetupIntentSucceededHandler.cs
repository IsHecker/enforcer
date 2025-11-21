using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.PaymentMethods;
using Microsoft.Extensions.DependencyInjection;
using Stripe;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents.EventHandlers;

[StripeEvent(EventTypes.SetupIntentSucceeded)]
internal sealed class SetupIntentSucceededHandler(
    IPaymentMethodRepository paymentMethodRepository,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork) : IStripeEventHandler
{
    public async Task<Result> HandleAsync(Event stripeEvent)
    {
        if (stripeEvent.Data.Object is not SetupIntent setupIntent)
            return Error.Validation();

        var consumerId = Guid.Parse("3FA85F64-5717-4562-B3FC-2C963F66AFA6");

        var stripePaymentMethod = await new PaymentMethodService().GetAsync(setupIntent.PaymentMethodId);
        var card = stripePaymentMethod.Card;

        var methodsCount = await paymentMethodRepository.GetCountByConsumerIdAsync(consumerId);

        var paymentMethod = Domain.PaymentMethods.PaymentMethod.Create(
            consumerId,
            setupIntent.CustomerId,
            setupIntent.PaymentMethodId,
            PaymentMethodType.CreditCard,
            card.Fingerprint,
            card.Last4,
            card.Brand,
            card.ExpMonth,
            card.ExpYear,
            stripePaymentMethod.BillingDetails.Address.ToJson(),
            methodsCount == 0
        );

        await paymentMethodRepository.AddAsync(paymentMethod);

        await unitOfWork.SaveChangesAsync();

        return Result.Success;
    }
}