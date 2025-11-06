using Enforcer.Common.Application.Caching;
using Enforcer.Common.Application.EventBus;
using Enforcer.Common.Infrastructure.Caching;
using Enforcer.Common.Infrastructure.Interceptors;
using MassTransit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Quartz;

namespace Enforcer.Common.Infrastructure;

public static class InfrastructureConfiguration
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        Action<IRegistrationConfigurator>[] moduleConfigureConsumers)
    {
        services.AddDistributedMemoryCache();
        services.TryAddSingleton<ICacheService, CacheService>();

        services.AddQuartz();
        services.AddQuartzHostedService(options => options.WaitForJobsToComplete = true);

        services.TryAddSingleton<PublishDomainEventsInterceptor>();
        services.TryAddSingleton<IEventBus, EventBus.EventBus>();

        services.AddMassTransit(configure =>
        {
            foreach (var configureConsumer in moduleConfigureConsumers)
            {
                configureConsumer(configure);
            }

            configure.SetKebabCaseEndpointNameFormatter();
            configure.UsingInMemory((context, cfg) =>
            {
                cfg.ConfigureEndpoints(context);
            });
        });

        return services;
    }
}