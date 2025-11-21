using Enforcer.Modules.Billings.Application.PaymentProcessing.DTOs;

namespace Enforcer.Modules.Billings.Application.Abstractions.Payments;

public interface IStripeService
{
    Task<string> GetCustomerAsync(Guid consumerId, CancellationToken ct);

    Task<string> CreateSetupSessionAsync(string stripeCustomerId, string returnUrl, CancellationToken ct);

    Task<string> CreateCheckoutSessionAsync(
        string stripeCustomerId,
        Guid invoiceId,
        long priceInCents,
        string productName,
        string returnUrl,
        CancellationToken ct);

    Task<StripePaymentMethodDto> GetPaymentMethodAsync(string paymentMethodId, CancellationToken ct);
}