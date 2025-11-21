namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.ProcessedStripeEvents;

public sealed class ProcessedStripeEvent
{
    public string EventId { get; init; } = null!;
    public DateTime ProcessedAt { get; init; } = DateTime.UtcNow;
}