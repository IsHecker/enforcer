namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing;

internal sealed class StripeOptions
{
    public const string SectionName = "Billings:Stripe";

    public string SecretKey { get; init; } = null!;
    public string PublishableKey { get; init; } = null!;
    public string WebhookSecret { get; init; } = null!;
}