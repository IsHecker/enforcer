using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Domain.Invoices;

namespace Enforcer.Modules.Billings.Application.Abstractions.Payments;

public interface IStripeGateway
{
    Task<string> CreateSetupSessionAsync(string stripeCustomerId, string returnUrl, CancellationToken ct);

    Task<string> CreateCheckoutSessionAsync(
        string stripeCustomerId,
        Invoice invoice,
        string returnUrl,
        CancellationToken ct);

    Task RemovePaymentMethodAsync(string stripePaymentMethodId, CancellationToken ct);

    Task<Result> ChargeAsync(
        Invoice invoice,
        CancellationToken ct);
}