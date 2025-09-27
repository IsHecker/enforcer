using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Application.Plans;
using Enforcer.Modules.ApiServices.Application.Subscriptions;
using Enforcer.Modules.ApiServices.Infrastructure.ApiServices;
using Enforcer.Modules.ApiServices.Infrastructure.Database;
using Enforcer.Modules.ApiServices.Infrastructure.Plans;
using Enforcer.Modules.ApiServices.Infrastructure.Subscriptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.ApiServices.Infrastructure;

public static class ApiServicesModule
{
    public static IServiceCollection AddApiServicesModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // services.AddEndpoints(Presentation.AssemblyReference.Assembly);

        services.AddInfrastructure(configuration);

        return services;
    }

    private static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApiServicesDbContext>(opts =>
            opts.UseSqlServer(configuration.GetConnectionString("Database")));

        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApiServicesDbContext>());

        services.AddScoped<IApiServiceRepository, ApiServiceRepository>();
        services.AddScoped<IPlanRepository, PlanRepository>();
        services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
    }
}