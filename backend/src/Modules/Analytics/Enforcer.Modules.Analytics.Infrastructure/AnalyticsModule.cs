using Enforcer.Common.Application.Data;
using Enforcer.Common.Infrastructure.Data;
using Enforcer.Common.Infrastructure.Interceptors;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Modules.Analytics.Application.Abstractions.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Analytics.Infrastructure.ApiServiceStats;
using Enforcer.Modules.Analytics.Infrastructure.Database;
using Enforcer.Modules.Analytics.Infrastructure.EndpointStats;
using Enforcer.Modules.Analytics.Infrastructure.Ratings;
using Enforcer.Modules.Analytics.Infrastructure.SubscriptionStats;
using Enforcer.Modules.Analytics.Presentation.IntegrationEvents;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Analytics.Infrastructure;

public static class AnalyticsModule
{
    public static IServiceCollection AddAnalyticsModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddEndpoints(Presentation.AssemblyReference.Assembly);

        services.AddInfrastructure(configuration);

        return services;
    }


    public static void ConfigureConsumers(IRegistrationConfigurator registrationConfigurator)
    {
        registrationConfigurator.AddConsumer<ApiServiceCreatedIntegrationEventConsumer>();
        registrationConfigurator.AddConsumer<EndpointCreatedIntegrationEventConsumer>();
        registrationConfigurator.AddConsumer<RequestForwardedIntegrationEventConsumer>();
        registrationConfigurator.AddConsumer<SubscriptionCreatedIntegrationEventConsumer>();
        registrationConfigurator.AddConsumer<SubscriptionCanceledIntegrationEventConsumer>();
        registrationConfigurator.AddConsumer<SubscriptionPlanChangedIntegrationEventConsumer>();
    }

    private static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AnalyticsDbContext>((sp, opts) =>
            opts.UseSqlServer(
                    configuration.GetConnectionString("Database"),
                    sqlOpts => sqlOpts
                        .MigrationsHistoryTable(HistoryRepository.DefaultTableName, Schemas.Analytics))
                .AddInterceptors(sp.GetRequiredService<PublishDomainEventsInterceptor>()));

        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<AnalyticsDbContext>());
        services.AddScoped<IAnalyticsDbContext>(sp => sp.GetRequiredService<AnalyticsDbContext>());

        services.AddScoped<IApiServiceStatRepository, ApiServiceStatRepository>();
        services.AddScoped<IEndpointStatRepository, EndpointStatRepository>();
        services.AddScoped<IRatingRepository, RatingRepository>();
        services.AddScoped<ISubscriptionStatRepository, SubscriptionStatRepository>();
    }
}