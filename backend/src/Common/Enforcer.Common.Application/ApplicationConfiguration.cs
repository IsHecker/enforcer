using System.Reflection;
using Enforcer.Common.Application.Behaviours;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Common.Application;

public static class ApplicationConfiguration
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services,
        Assembly[] moduleAssemblies)
    {
        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssemblies(moduleAssemblies);

            config.AddOpenBehavior(typeof(ExceptionHandlingBehavior<,>));
            config.AddOpenBehavior(typeof(UnitOfWorkBehaviour<,>));
            config.AddOpenBehavior(typeof(ValidationBehaviour<,>));
        });

        services.AddValidatorsFromAssemblies(moduleAssemblies, includeInternalTypes: true);
        return services;
    }
}