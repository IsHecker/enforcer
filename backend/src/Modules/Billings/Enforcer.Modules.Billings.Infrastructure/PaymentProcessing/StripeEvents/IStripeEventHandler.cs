using Enforcer.Common.Domain.Results;
using Stripe;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents;

internal interface IStripeEventHandler
{
    Task<Result> HandleAsync(Event stripeEvent);
}

internal abstract class StripeEventHandler<TEntity> : IStripeEventHandler
    where TEntity : class, IStripeEntity
{
    public abstract Task<Result> HandleAsync(TEntity stripeEvent);

    async Task<Result> IStripeEventHandler.HandleAsync(Event stripeEvent)
    {
        if (stripeEvent.Data.Object is not TEntity entity)
            return Error.Validation();

        return await HandleAsync(entity);
    }
}