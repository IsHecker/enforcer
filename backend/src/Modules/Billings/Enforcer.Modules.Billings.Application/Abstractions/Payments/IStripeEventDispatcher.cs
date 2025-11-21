using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.Billings.Application.Abstractions.Payments;

public interface IStripeEventDispatcher
{
    Task<Result> DispatchAsync(string eventJson, string stripeSignature);
}