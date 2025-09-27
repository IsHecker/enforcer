using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Common.Infrastructure;

public static class InfrastructureConfiguration
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services)
    {
        return services;
    }
}