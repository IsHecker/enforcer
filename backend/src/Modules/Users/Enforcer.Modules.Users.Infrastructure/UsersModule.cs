using Enforcer.Common.Application.Authorization;
using Enforcer.Common.Application.Data;
using Enforcer.Common.Infrastructure.Data;
using Enforcer.Common.Infrastructure.Interceptors;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Modules.Users.Application.Abstractions.Data;
using Enforcer.Modules.Users.Application.Abstractions.Identity;
using Enforcer.Modules.Users.Domain.Users;
using Enforcer.Modules.Users.Infrastructure.Authorization;
using Enforcer.Modules.Users.Infrastructure.Database;
using Enforcer.Modules.Users.Infrastructure.Identity;
using Enforcer.Modules.Users.Infrastructure.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Enforcer.Modules.Users.Infrastructure;

public static class UsersModule
{
    public static IServiceCollection AddUsersModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddEndpoints(Presentation.AssemblyReference.Assembly);

        services.AddInfrastructure(configuration);

        return services;
    }

    private static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        AddDbContext(services, configuration);
        AddServices(services);
        AddRepositories(services);
    }

    private static void AddDbContext(IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<UsersDbContext>((sp, opts) =>
            opts.UseSqlServer(
                    configuration.GetConnectionString("Database"),
                    sqlOpts => sqlOpts
                        .MigrationsHistoryTable(HistoryRepository.DefaultTableName, Schemas.Users))
                .AddInterceptors(sp.GetRequiredService<PublishDomainEventsInterceptor>())
                .LogTo(_ => { }, LogLevel.None));

        services.AddKeyedScoped<IUnitOfWork>(nameof(Users), (sp, _) => sp.GetRequiredService<UsersDbContext>());
        services.AddScoped<IUsersDbContext>(sp => sp.GetRequiredService<UsersDbContext>());
    }

    private static void AddRepositories(IServiceCollection services)
    {
        services.AddScoped<IUserRepository, UserRepository>();
    }

    private static void AddServices(IServiceCollection services)
    {
        services.AddScoped<IPermissionService, PermissionService>();

        services.AddTransient<IIdentityProviderService, IdentityProviderService>();
    }

    // private static void AddDomainEventHandlers(this IServiceCollection services)
    // {
    //     Type[] domainEventHandlers = Application.AssemblyReference.Assembly
    //         .GetTypes()
    //         .Where(t => t.IsAssignableTo(typeof(IDomainEventHandler)))
    //         .ToArray();

    //     foreach (Type domainEventHandler in domainEventHandlers)
    //     {
    //         services.TryAddScoped(domainEventHandler);

    //         Type domainEvent = domainEventHandler
    //             .GetInterfaces()
    //             .Single(i => i.IsGenericType)
    //             .GetGenericArguments()
    //             .Single();

    //         Type closedIdempotentHandler = typeof(IdempotentDomainEventHandler<>).MakeGenericType(domainEvent);

    //         services.Decorate(domainEventHandler, closedIdempotentHandler);
    //     }
    // }
}
