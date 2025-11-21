using Microsoft.Extensions.Options;
using Quartz;

namespace Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.ExpiredSubscriptionCleanup;

internal sealed class ExpiredSubscriptionCleanupJobConfiguration(IOptions<ExpiredSubscriptionCleanupOptions> options)
    : IConfigureOptions<QuartzOptions>
{
    private readonly ExpiredSubscriptionCleanupOptions _options = options.Value;

    public void Configure(QuartzOptions options)
    {
        if (!_options.Enabled)
            return;

        string jobName = typeof(ExpiredSubscriptionCleanupJob).FullName!;

        options
            .AddJob<ExpiredSubscriptionCleanupJob>(configure => configure.WithIdentity(jobName))
            .AddTrigger(configure =>
                configure
                    .ForJob(jobName)
                    .WithSimpleSchedule(schedule =>
                        schedule.WithInterval(_options.RunInterval).RepeatForever()));
    }
}