using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.InvoiceLineItems;
using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.Domain.PaymentMethods;
using Enforcer.Modules.Billings.Infrastructure.PaymentMethods;
using Stripe.Checkout;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing;

internal sealed class StripeGateway(IPaymentMethodRepository paymentMethodRepository) : IStripeGateway
{
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

    public async Task<string> CreateCheckoutSessionAsync(
        string stripeCustomerId,
        Invoice invoice,
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
            LineItems = BuildLineItems(invoice),
            SuccessUrl = returnUrl,
            CancelUrl = returnUrl,
            PaymentIntentData = new SessionPaymentIntentDataOptions
            {
                Metadata = new Dictionary<string, string>
                {
                    ["InvoiceId"] = invoice.Id.ToString(),
                    ["CheckoutMode"] = "true"
                }
            }
        };

        var session = await new SessionService().CreateAsync(options, cancellationToken: ct);
        return session.Url;
    }

    private static List<SessionLineItemOptions> BuildLineItems(Invoice invoice)
    {
        return invoice.LineItems
            .Where(item => item.Type != InvoiceItemType.Tax)
            .Select(item => new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    Currency = invoice.Currency.ToLower(),
                    UnitAmount = item.UnitPrice,
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = GetDisplayName(item),
                        Description = item.Description
                    }
                },
                Quantity = item.Quantity
            })
            .ToList();
    }
    private static string GetDisplayName(InvoiceLineItem item) => item.Type switch
    {
        InvoiceItemType.Subscription => item.Description,
        InvoiceItemType.Overage => $"Overage: {item.Description}",
        InvoiceItemType.Fee => "Fee",
        InvoiceItemType.Discount => $"Discount: {item.Description}",
        _ => item.Description
    };

    public async Task<Result> ChargeAsync(
        Invoice invoice,
        CancellationToken ct)
    {
        try
        {
            var paymentMethod = await paymentMethodRepository.GetDefaultAsync(invoice.ConsumerId, ct);

            if (paymentMethod is null)
                return PaymentMethodErrors.NoDefaultPaymentMethod;

            var options = new Stripe.PaymentIntentCreateOptions
            {
                Amount = invoice.Total,
                Currency = invoice.Currency.ToLower(),
                Customer = paymentMethod.StripeCustomerId,
                PaymentMethod = paymentMethod.StripePaymentMethodId,
                Description = BuildDescription(invoice),
                OffSession = true,
                Confirm = true,
                Metadata = new Dictionary<string, string>
                {
                    ["InvoiceId"] = invoice.Id.ToString()
                }
            };

            var paymentIntent = await new Stripe.PaymentIntentService().CreateAsync(options, cancellationToken: ct);

            return paymentIntent.Status == "succeeded"
                ? Result.Success
                : Error.Failure(
                    paymentIntent.LastPaymentError?.Code ?? "unknown",
                    paymentIntent.LastPaymentError?.Message ?? "Payment failed");
        }
        catch (Stripe.StripeException ex)
        {
            return Error.Failure(ex.StripeError.Code, ex.StripeError.Message);
        }
    }
    private static string BuildDescription(Invoice invoice)
    {
        var mainItem = invoice.LineItems.FirstOrDefault(x => x.Type == InvoiceItemType.Subscription);
        return mainItem?.Description ?? "Subscription Renewal";
    }

    public async Task RemovePaymentMethodAsync(string stripePaymentMethodId, CancellationToken ct)
    {
        await new Stripe.PaymentMethodService().DetachAsync(stripePaymentMethodId, cancellationToken: ct);
    }
}