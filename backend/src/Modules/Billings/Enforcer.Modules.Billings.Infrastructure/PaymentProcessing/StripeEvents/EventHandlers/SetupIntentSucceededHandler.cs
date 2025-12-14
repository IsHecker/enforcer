using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.PaymentMethods;
using Microsoft.Extensions.DependencyInjection;
using Stripe;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents.EventHandlers;

[StripeEvent(EventTypes.SetupIntentSucceeded)]
internal sealed class SetupIntentSucceededHandler(
    IPaymentMethodRepository paymentMethodRepository,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork) : StripeEventHandler<SetupIntent>
{
    public override async Task<Result> HandleAsync(SetupIntent setupIntent)
    {
        var consumerId = SharedData.UserId;

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
            stripePaymentMethod.BillingDetails.Address.ToJson()
        );

        if (methodsCount == 0)
            paymentMethod.SetAsDefault();

        await paymentMethodRepository.AddAsync(paymentMethod);

        await unitOfWork.SaveChangesAsync();

        return Result.Success;
    }
}