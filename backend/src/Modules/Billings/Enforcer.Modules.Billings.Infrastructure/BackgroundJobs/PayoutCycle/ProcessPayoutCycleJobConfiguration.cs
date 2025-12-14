using Microsoft.Extensions.Options;
using Quartz;

namespace Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.PayoutCycle;

internal sealed class ProcessPayoutCycleJobConfiguration(IOptions<PayoutCycleOptions> options)
    : IConfigureOptions<QuartzOptions>
{
    private readonly PayoutCycleOptions _options = options.Value;

    public void Configure(QuartzOptions options)
    {
        if (!_options.Enabled)
            return;

        string jobName = typeof(ProcessPayoutCycleJob).FullName!;

        options
            .AddJob<ProcessPayoutCycleJob>(configure => configure.WithIdentity(jobName))
            .AddTrigger(configure =>
                configure
                    .ForJob(jobName)
                    // .WithCronSchedule(_options.CronSchedule)
                    .WithSimpleSchedule(schedule =>
                        schedule.WithInterval(_options.RunInterval).RepeatForever()));
    }
}