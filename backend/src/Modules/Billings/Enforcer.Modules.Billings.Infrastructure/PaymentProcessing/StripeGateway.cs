using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.InvoiceLineItems;
using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.Domain.PaymentMethods;
using Enforcer.Modules.Billings.Domain.Refunds;
using Enforcer.Modules.Billings.Infrastructure.Payments;
using Microsoft.Extensions.DependencyInjection;
using Stripe.Checkout;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing;

internal sealed class StripeGateway(
    IPaymentMethodRepository paymentMethodRepository,
    PaymentRepository paymentRepository) : IStripeGateway
{
    public async Task<string> CreateSetupSessionAsync(
        string stripeCustomerId,
        string returnUrl,
        CancellationToken cancellationToken = default)
    {
        var options = new SessionCreateOptions
        {
            Mode = "setup",
            Customer = stripeCustomerId,
            Currency = "usd",
            SuccessUrl = returnUrl,
            CancelUrl = returnUrl
        };

        Session session = await new SessionService().CreateAsync(options, cancellationToken: cancellationToken = default);

        return session.Url;
    }

    public async Task<string> CreateCheckoutSessionAsync(
        string stripeCustomerId,
        Invoice invoice,
        Guid creatorId,
        Guid consumerId,
        Guid planId,
        string returnUrl,
        CancellationToken cancellationToken = default)
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
            PaymentIntentData = new SessionPaymentIntentDataOptions()
            .WithKey(MetadataKeys.InvoiceId, invoice.Id)
            .WithKey(MetadataKeys.CreatorId, creatorId)
            .WithKey(MetadataKeys.ConsumerId, consumerId)
            .WithKey(MetadataKeys.PlanId, planId)
            .WithKey(MetadataKeys.CheckoutMode, "true")
        };

        var session = await new SessionService().CreateAsync(options, cancellationToken: cancellationToken);
        return session.Url;
    }

    private static List<SessionLineItemOptions> BuildLineItems(Invoice invoice)
    {
        return invoice.LineItems
            .Where(item => item.Type is InvoiceItemType.Subscription)
            .Select(item => new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    Currency = invoice.Currency.ToLower(),
                    UnitAmount = invoice.Total,
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = item.Description,
                        Description = "Total after credits and charges applied"
                    }
                },
                Quantity = item.Quantity
            })
            .ToList();
    }

    public async Task<Result> ChargeAsync(
        Invoice invoice,
        Dictionary<string, string> metadata = null!,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var paymentMethod = await paymentMethodRepository.GetDefaultAsync(invoice.ConsumerId, cancellationToken = default);

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
                Metadata = metadata
            }
            .WithKey(MetadataKeys.InvoiceId, invoice.Id)
            .WithKey(MetadataKeys.PaymentMethodId, paymentMethod.Id);

            var paymentIntent = await new Stripe.PaymentIntentService()
                .CreateAsync(options, cancellationToken: cancellationToken = default);

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

    public async Task RemovePaymentMethodAsync(string stripePaymentMethodId, CancellationToken cancellationToken = default)
    {
        await new Stripe.PaymentMethodService().DetachAsync(stripePaymentMethodId, cancellationToken: cancellationToken = default);
    }

    public async Task<Result> RefundAsync(Refund refund, CancellationToken cancellationToken = default)
    {
        try
        {
            var payment = await paymentRepository.GetLastBySucceededInvoiceId(refund.InvoiceId, cancellationToken = default);
            if (payment is null)
                return Error.NotFound(
                    "Refund.NoPaymentsFound",
                    "Invoice has no associated payments");

            var refundOptions = new Stripe.RefundCreateOptions
            {
                PaymentIntent = payment.PaymentTransactionId,
                Amount = refund.Amount,
                Reason = "requested_by_customer"
            }
            .WithKey(MetadataKeys.RefundId, refund.Id);

            await new Stripe.RefundService().CreateAsync(refundOptions, cancellationToken: cancellationToken = default);

            return Result.Success;
        }
        catch (Stripe.StripeException ex)
        {
            return Error.Failure(
                $"Stripe.Refund.{ex.StripeError.Code}",
                ex.StripeError.Message
            );
        }
        catch (Exception ex)
        {
            return Error.Failure(
                "Refund.UnexpectedError",
                $"Unexpected error processing refund: {ex.Message}"
            );
        }
    }

    public async Task<string> CreateConnectAccountAsync(
        Guid userId,
        string country,
        CancellationToken cancellationToken = default)
    {
        var accountOptions = new Stripe.AccountCreateOptions
        {
            Type = "express",
            Country = country,
            Email = SharedData.UserEmail,
            Capabilities = new Stripe.AccountCapabilitiesOptions
            {
                Transfers = new Stripe.AccountCapabilitiesTransfersOptions { Requested = true }
            },
            TosAcceptance = new Stripe.AccountTosAcceptanceOptions
            {
                ServiceAgreement = country == "US" ? "full" : "recipient"
            },
            Metadata = new Dictionary<string, string>
            {
                [MetadataKeys.UserId.Key] = userId.ToString()
            }
        };

        var account = await new Stripe.AccountService()
            .CreateAsync(accountOptions, cancellationToken: cancellationToken);

        return account.Id;
    }

    public async Task<Result<string>> CreateOnboardingSessionAsync(
        string stripeConnectAccountId,
        string returnUrl,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var accountLinkOptions = new Stripe.AccountLinkCreateOptions
            {
                Account = stripeConnectAccountId,
                RefreshUrl = $"{returnUrl}?refresh=true",
                ReturnUrl = $"{returnUrl}?success=true",
                Type = "account_onboarding"
            };

            var accountLink = await new Stripe.AccountLinkService()
                .CreateAsync(accountLinkOptions, cancellationToken: cancellationToken);

            return accountLink.Url;
        }
        catch (Stripe.StripeException ex)
        {
            return Error.Failure("Stripe.ConnectFailed", ex.Message);
        }
    }

    public async Task<Result<string>> SendPayoutAsync(
        string connectedAccountId,
        long amount,
        Dictionary<string, string> metadata = null!,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var options = new Stripe.TransferCreateOptions
            {
                Amount = amount,
                Currency = "usd",
                Destination = connectedAccountId,
                Metadata = metadata
            };

            var transfer = await new Stripe.TransferService().CreateAsync(options, cancellationToken: cancellationToken);

            return transfer.Id;
        }
        catch (Stripe.StripeException ex)
        {
            return Error.Failure(
                $"Stripe.Transfer.{ex.StripeError.Code}",
                ex.StripeError.Message);
        }
    }

    public async Task DeleteAccount(string accountId)
    {
        var service = new Stripe.AccountService();
        var deleted = await service.DeleteAsync(accountId);
    }
}