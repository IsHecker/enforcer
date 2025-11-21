using Microsoft.Extensions.Options;
using Quartz;

namespace Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.SubscriptionRenewal;

internal sealed class SubscriptionRenewalJobConfiguration(IOptions<SubscriptionRenewalOptions> options)
    : IConfigureOptions<QuartzOptions>
{
    private readonly SubscriptionRenewalOptions _options = options.Value;

    public void Configure(QuartzOptions options)
    {
        if (!_options.Enabled)
            return;

        string jobName = typeof(SubscriptionRenewalJob).FullName!;

        options
            .AddJob<SubscriptionRenewalJob>(configure => configure.WithIdentity(jobName))
            .AddTrigger(configure =>
                configure
                    .ForJob(jobName)
                    .WithSimpleSchedule(schedule =>
                        schedule.WithInterval(_options.RunInterval).RepeatForever()));
    }
}