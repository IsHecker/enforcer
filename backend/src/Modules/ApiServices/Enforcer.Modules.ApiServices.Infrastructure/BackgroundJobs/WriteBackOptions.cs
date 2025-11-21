namespace Enforcer.Modules.ApiServices.Infrastructure.BackgroundJobs;

internal sealed class WriteBackOptions
{
    public const string SectionName = "ApiServices:WriteBack";

    public bool Enabled { get; init; }
    public int IntervalInSeconds { get; init; }
}