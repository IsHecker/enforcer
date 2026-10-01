using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.ApiServices.PublicApi;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Infrastructure.Invoicing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.SubscriptionRenewal;

internal sealed class SubscriptionRenewalService(
    IStripeGateway stripeGateway,
    IInvoiceRepository invoiceRepository,
    IApiServicesApi servicesApi,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork,
    ILogger<SubscriptionRenewalService> logger)
{
    public async Task<Result> RenewAsync(SubscriptionResponse subscription, CancellationToken cancellationToken)
    {
        var invoice = InvoiceFactory.ForRenewal(subscription);

        await invoiceRepository.AddAsync(invoice, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        var chargeResult = await stripeGateway.ChargeAsync(
            invoice,
            cancellationToken: cancellationToken);

        if (chargeResult.IsFailure)
        {
            var error = chargeResult.Error;

            logger.LogWarning(
                "Renewal charge failed for subscription {SubscriptionId}: {ErrorCode} - {ErrorMessage}",
                subscription.Id,
                error.Code,
                error.Description);

            return error;
        }

        await servicesApi.RenewSubscription(subscription.Id, cancellationToken);

        return Result.Success;
    }
}