using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.Domain.RefundTransactions;

namespace Enforcer.Modules.Billings.Application.Abstractions.Payments;

public interface IStripeGateway
{
    Task<string> CreateSetupSessionAsync(string stripeCustomerId, string returnUrl, CancellationToken cancellationToken);

    Task<string> CreateCheckoutSessionAsync(
        string stripeCustomerId,
        Invoice invoice,
        string returnUrl,
        CancellationToken cancellationToken);

    Task RemovePaymentMethodAsync(string stripePaymentMethodId, CancellationToken cancellationToken);

    Task<Result> ChargeAsync(
        Invoice invoice,
        CancellationToken cancellationToken);

    Task<Result> RefundAsync(RefundTransaction refund, CancellationToken cancellationToken);
}