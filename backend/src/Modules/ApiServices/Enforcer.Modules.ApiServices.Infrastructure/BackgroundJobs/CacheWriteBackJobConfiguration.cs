using Microsoft.Extensions.Options;
using Quartz;

namespace Enforcer.Modules.ApiServices.Infrastructure.BackgroundJobs;

internal sealed class CacheWriteBackJobConfiguration(IOptions<WriteBackOptions> options)
    : IConfigureOptions<QuartzOptions>
{
    private readonly WriteBackOptions _options = options.Value;

    public void Configure(QuartzOptions options)
    {
        if (!_options.Enabled)
            return;

        string jobName = typeof(CacheWriteBackJob).FullName!;

        options
            .AddJob<CacheWriteBackJob>(configure => configure.WithIdentity(jobName))
            .AddTrigger(configure =>
                configure
                    .ForJob(jobName)
                    .WithSimpleSchedule(schedule =>
                        schedule.WithIntervalInSeconds(_options.IntervalInSeconds).RepeatForever()));
    }
}