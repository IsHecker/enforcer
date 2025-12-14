namespace Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.PayoutCycle;

internal sealed class PayoutCycleOptions
{
    public const string SectionName = "Billings:Payout:PayoutCycle";

    public bool Enabled { get; init; }
    public string CronSchedule { get; init; } = null!;
    public float RunIntervalInMinutes { get; init; }
    public int BatchSize { get; init; }
    public int RetryCount { get; set; }

    public TimeSpan RunInterval => TimeSpan.FromMinutes(RunIntervalInMinutes);
}