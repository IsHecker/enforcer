namespace Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.ExpiredSubscriptionCleanup;

internal sealed class ExpiredSubscriptionCleanupOptions
{
    public const string SectionName = "Billings:ExpiredSubscriptionCleanup";

    public bool Enabled { get; init; }
    public float RunIntervalInMinutes { get; init; }
    public int BatchSize { get; init; }
    public int ConcurrentCleanups { get; init; }

    public TimeSpan RunInterval => TimeSpan.FromMinutes(RunIntervalInMinutes);
}