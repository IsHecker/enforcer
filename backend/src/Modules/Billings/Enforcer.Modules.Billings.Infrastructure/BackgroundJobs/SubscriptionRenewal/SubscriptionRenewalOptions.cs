namespace Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.SubscriptionRenewal;

internal sealed class SubscriptionRenewalOptions
{
    public const string SectionName = "Billings:SubscriptionRenewal";

    public bool Enabled { get; init; } = true;
    public float RunIntervalInMinutes { get; init; }
    public int BatchSize { get; init; }
    public int MaxFailedPaymentRetries { get; init; }
    public int RetryDelayHours { get; init; }
    public int RenewalTimeoutSeconds { get; init; }
    public int ConcurrentRenewals { get; init; }

    public TimeSpan RunInterval => TimeSpan.FromMinutes(RunIntervalInMinutes);
    public TimeSpan RetryDelay => TimeSpan.FromHours(RetryDelayHours);
    public TimeSpan RenewalTimeout => TimeSpan.FromSeconds(RenewalTimeoutSeconds);
}