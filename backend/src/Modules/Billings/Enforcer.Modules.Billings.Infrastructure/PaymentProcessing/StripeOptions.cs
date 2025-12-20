namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing;

internal sealed class StripeOptions
{
    public const string SectionName = "Billings:Stripe";

    public string WebhookSecret { get; init; } = null!;
    public string ConnectWebhookSecret { get; init; } = null!;
}