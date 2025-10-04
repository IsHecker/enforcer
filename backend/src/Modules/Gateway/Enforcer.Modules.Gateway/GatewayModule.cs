using Enforcer.Modules.Gateway.EndpointResolution;
using Enforcer.Modules.Gateway.EndpointTrieProvider;
using Enforcer.Modules.Gateway.RequestValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Gateway;

public static class GatewayModule
{
    public static IApplicationBuilder UseGatewayPipeline(this IApplicationBuilder app)
    {
        app.UseMiddleware<RequestValidationMiddleware>();
        app.UseMiddleware<EndpointTrieProviderMiddleware>();
        app.UseMiddleware<EndpointResolverMiddleware>();

        return app;
    }

    public static IServiceCollection AddGatewayModule(this IServiceCollection services)
    {
        return services;
    }
}