using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.Payments;

public sealed class Payment : Entity
{
    public string PaymentNumber { get; private set; } = null!;

    public Guid InvoiceId { get; private set; }
    public Guid ConsumerId { get; private set; }

    public decimal Amount { get; private set; }
    public string Currency { get; private set; }
    public decimal RefundedAmount { get; private set; }

    public Guid? PaymentMethodId { get; private set; }
    public string PaymentTransactionId { get; private set; } // Stripe PaymentIntent ID

    public PaymentStatus Status { get; private set; }

    public DateTime InitiatedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }

    public string? FailureCode { get; private set; }
    public string? FailureMessage { get; private set; }
    public DateTime? FailedAt { get; private set; }

    public int RetryCount { get; private set; }
    public DateTime? LastRetryAt { get; private set; }

    public DateTime? LastPaymentAttempt { get; private set; }
    public DateTime? NextPaymentRetry { get; private set; }

    private Payment() { }

    public static Payment Create(
        Guid invoiceId,
        Guid consumerId,
        Guid? paymentMethodId,
        string paymentTransactionId,
        decimal amount,
        string currency,
        PaymentStatus status,
        string? failureCode = null,
        string? failureMessage = null)
    {
        return new Payment
        {
            PaymentNumber = $"Pay-{Guid.NewGuid().ToString()[..10].ToUpper()}",
            InvoiceId = invoiceId,
            ConsumerId = consumerId,
            Amount = amount,
            Currency = currency,
            PaymentMethodId = paymentMethodId,
            PaymentTransactionId = paymentTransactionId,
            Status = status,
            InitiatedAt = DateTime.UtcNow,
            CompletedAt = status == PaymentStatus.Succeeded ? DateTime.UtcNow : null,
            FailedAt = status == PaymentStatus.Failed ? DateTime.UtcNow : null,
            FailureCode = failureCode,
            FailureMessage = failureMessage
        };
    }
}