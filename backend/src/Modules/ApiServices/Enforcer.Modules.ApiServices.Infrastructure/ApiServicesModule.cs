using Enforcer.Common.Application.Data;
using Enforcer.Common.Infrastructure;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Application.Endpoints;
using Enforcer.Modules.ApiServices.Application.Plans;
using Enforcer.Modules.ApiServices.Application.Subscriptions;
using Enforcer.Modules.ApiServices.Infrastructure.ApiServices;
using Enforcer.Modules.ApiServices.Infrastructure.BackgroundJobs;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Enforcer.Modules.ApiServices.Infrastructure.Endpoints;
using Enforcer.Modules.ApiServices.Infrastructure.Plans;
using Enforcer.Modules.ApiServices.Infrastructure.PublicApi;
using Enforcer.Modules.ApiServices.Infrastructure.Subscriptions;
using Enforcer.Modules.ApiServices.PublicApi;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.ApiServices.Infrastructure;

public static class ApiServicesModule
{
    public static IServiceCollection AddApiServicesModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddEndpoints(Presentation.AssemblyReference.Assembly);

        services.AddInfrastructure(configuration);

        return services;
    }

    private static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApiServicesDbContext>(opts =>
            opts.UseSqlServer(
                configuration.GetConnectionString("Database"),
                sqlOpts => sqlOpts.MigrationsHistoryTable(HistoryRepository.DefaultTableName, Schemas.ApiServices)));

        services.Configure<WriteBackOptions>(configuration.GetSection("ApiServices:WriteBack"));
        services.ConfigureOptions<CacheWriteBackJobConfiguration>();

        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApiServicesDbContext>());
        services.AddScoped<IApiServicesDbContext>(sp => sp.GetRequiredService<ApiServicesDbContext>());

        services.AddScoped<IApiServiceRepository, ApiServiceRepository>();
        services.AddScoped<IEndpointRepository, EndpointRepository>();
        services.AddScoped<IPlanRepository, PlanRepository>();
        services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();

        services.AddScoped<IApiServicesApi, ApiServicesApi>();
    }
}