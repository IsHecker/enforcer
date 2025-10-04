using Enforcer.Common.Application.Caching;
using Enforcer.Common.Infrastructure.Caching;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Enforcer.Common.Infrastructure;

public static class InfrastructureConfiguration
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services)
    {
        services.TryAddSingleton<ICacheService, CacheService>();
        return services;
    }
}