using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.PaymentProcessing.DTOs;
using Stripe.Checkout;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing;

internal sealed class StripeService() : IStripeService
{
    public async Task<string> CreateCheckoutSessionAsync(
        string stripeCustomerId,
        Guid invoiceId,
        long priceInCents,
        string productName,
        string returnUrl,
        CancellationToken ct)
    {
        var options = new SessionCreateOptions
        {
            Mode = "payment",
            Customer = stripeCustomerId,
            PaymentMethodTypes = ["card"],
            SavedPaymentMethodOptions = new SessionSavedPaymentMethodOptionsOptions
            {
                PaymentMethodSave = "enabled"
            },
            LineItems = [
                new SessionLineItemOptions()
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "usd",
                        UnitAmount = priceInCents,
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = productName,
                            Description = productName
                        }
                    },
                    Quantity = 1
                }
            ],
            SuccessUrl = returnUrl,
            CancelUrl = returnUrl,
            PaymentIntentData = new SessionPaymentIntentDataOptions
            {
                Metadata = new Dictionary<string, string>
                {
                    ["InvoiceId"] = invoiceId.ToString(),
                    ["CheckoutMode"] = "true"
                }
            }
        };

        var session = await new SessionService().CreateAsync(options, cancellationToken: ct);

        return session.Url;
    }

    public async Task<string> CreateSetupSessionAsync(string stripeCustomerId, string returnUrl, CancellationToken ct)
    {
        var options = new SessionCreateOptions
        {
            Mode = "setup",
            Customer = stripeCustomerId,
            Currency = "usd",
            SuccessUrl = returnUrl,
            CancelUrl = returnUrl
        };

        Session session = await new SessionService().CreateAsync(options, cancellationToken: ct);

        return session.Url;
    }

    public Task<string> GetCustomerAsync(Guid consumerId, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public Task<StripePaymentMethodDto> GetPaymentMethodAsync(string paymentMethodId, CancellationToken ct)
    {
        throw new NotImplementedException();
    }


}