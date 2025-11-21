using Enforcer.Common.Domain.Results;
using Stripe;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents;

internal interface IStripeEventHandler
{
    Task<Result> HandleAsync(Event stripeEvent);
}