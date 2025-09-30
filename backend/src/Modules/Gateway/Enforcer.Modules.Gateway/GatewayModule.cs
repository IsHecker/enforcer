using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Gateway;

public static class GatewayModule
{
    public static IApplicationBuilder UseGatewayPipeline(this IApplicationBuilder app)
    {
        return app;
    }

    public static IServiceCollection AddGatewayModule(this IServiceCollection services)
    {
        return services;
    }
}