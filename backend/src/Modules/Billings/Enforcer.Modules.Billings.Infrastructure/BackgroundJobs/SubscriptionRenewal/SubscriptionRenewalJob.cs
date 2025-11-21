using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.ApiServices.PublicApi;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Quartz;
using Stripe;

namespace Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.SubscriptionRenewal;

[DisallowConcurrentExecution]
internal sealed class SubscriptionRenewalJob(
    IOptions<SubscriptionRenewalOptions> options,
    IApiServicesApi servicesApi,
    ILogger<SubscriptionRenewalJob> logger) : IJob
{
    private readonly SubscriptionRenewalOptions _options = options.Value;

    public async Task Execute(IJobExecutionContext context)
    {
        logger.LogInformation("Starting subscription renewal job");

        var expiredSubscriptions = await servicesApi.GetExpiredSubscriptions(_options.BatchSize, context.CancellationToken);

        logger.LogInformation(
            "Found {Count} subscriptions to renew",
            expiredSubscriptions.Count);

        var successCount = 0;
        var failureCount = 0;

        foreach (var subscription in expiredSubscriptions)
        {
            try
            {
                var paymentResult = await ChargeAsync(
                    subscription,
                    null!,
                    "paymentMethodId",
                    "customerId",
                    Guid.Empty
                );

                if (paymentResult.IsSuccess)
                {
                    await servicesApi.RenewSubscription(subscription.Id, context.CancellationToken);
                    successCount++;

                    logger.LogDebug(
                        "Successfully renewed subscription {SubscriptionId}",
                        subscription.Id);
                }

            }
            catch (Exception ex)
            {
                failureCount++;

                logger.LogError(ex,
                    "Failed to renew subscription {SubscriptionId}",
                    subscription.Id);
            }
        }

        logger.LogInformation(
            "Subscription renewal completed. Success: {SuccessCount}, Failed: {FailureCount}",
            successCount, failureCount);
    }

    private async Task<Result> ChargeAsync(
        SubscriptionResponse subscription,
        PlanResponse plan,
        string stripePaymentMethodId,
        string stripeCustomerId,
        Guid paymentMethodId)
    {
        var invoice = Domain.Invoices.Invoice.Create("USD");

        var paymentIntent = await new PaymentIntentService().CreateAsync(new()
        {
            Amount = plan.PriceInCents,
            Currency = "usd",
            Customer = stripeCustomerId,
            PaymentMethod = stripePaymentMethodId,
            Description = $"{plan.Name} - {plan.BillingPeriod}",
            OffSession = true,
            Confirm = true,
            Metadata = new Dictionary<string, string>
            {
                ["InvoiceId"] = invoice.Id.ToString(),
                ["PaymentMethodId"] = paymentMethodId.ToString()
            }
        });

        return paymentIntent.Status == "success" ?
            Result.Success
            : Error.Failure(
                paymentIntent.LastPaymentError.Code,
                paymentIntent.LastPaymentError.Message);
    }
}