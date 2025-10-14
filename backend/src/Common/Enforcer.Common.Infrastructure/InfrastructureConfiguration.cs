using Enforcer.Common.Application.Caching;
using Enforcer.Common.Infrastructure.Caching;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Quartz;

namespace Enforcer.Common.Infrastructure;

public static class InfrastructureConfiguration
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services)
    {
        services.AddDistributedMemoryCache();
        services.TryAddSingleton<ICacheService, CacheService>();

        services.AddQuartz();
        services.AddQuartzHostedService(options => options.WaitForJobsToComplete = true);

        return services;
    }
}