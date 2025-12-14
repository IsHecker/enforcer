using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Domain.Invoices;
using Enforcer.Modules.Billings.Domain.RefundTransactions;

namespace Enforcer.Modules.Billings.Application.Abstractions.Payments;

public interface IStripeGateway
{
    Task<string> CreateSetupSessionAsync(
        string stripeCustomerId,
        string returnUrl,
        CancellationToken cancellationToken = default);

    Task<string> CreateCheckoutSessionAsync(
        string stripeCustomerId,
        Invoice invoice,
        Guid creatorId,
        Guid consumerId,
        Guid planId,
        string returnUrl,
        CancellationToken cancellationToken = default);

    Task RemovePaymentMethodAsync(string stripePaymentMethodId, CancellationToken cancellationToken = default);

    Task<Result> ChargeAsync(
        Invoice invoice,
        Dictionary<string, string> metadata = null!,
        CancellationToken cancellationToken = default);

    Task<Result> RefundAsync(RefundTransaction refund, CancellationToken cancellationToken = default);

    Task<Result<string>> SendPayoutAsync(
        string connectedAccountId,
        long amount,
        Dictionary<string, string> metadata = null!,
        CancellationToken cancellationToken = default);
}