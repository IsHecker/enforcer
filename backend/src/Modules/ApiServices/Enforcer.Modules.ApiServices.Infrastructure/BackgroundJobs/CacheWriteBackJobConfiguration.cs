using Microsoft.Extensions.Options;
using Quartz;

namespace Enforcer.Modules.ApiServices.Infrastructure.BackgroundJobs;

internal sealed class CacheWriteBackJobConfiguration(IOptions<WriteBackOptions> writeBackOptions)
    : IConfigureOptions<QuartzOptions>
{
    private readonly WriteBackOptions _writeBackOptions = writeBackOptions.Value;

    public void Configure(QuartzOptions options)
    {
        string jobName = typeof(CacheWriteBackJob).FullName!;

        options
            .AddJob<CacheWriteBackJob>(configure => configure.WithIdentity(jobName))
            .AddTrigger(configure =>
                configure
                    .ForJob(jobName)
                    .WithSimpleSchedule(schedule =>
                        schedule.WithIntervalInSeconds(_writeBackOptions.IntervalInSeconds).RepeatForever()));
    }
}