using System.Net;
using Enforcer.Modules.Gateway.EndpointResolution;
using Enforcer.Modules.Gateway.EndpointTrieProvider;
using Enforcer.Modules.Gateway.Performance;
using Enforcer.Modules.Gateway.RateLimiting;
using Enforcer.Modules.Gateway.RequestForwarding;
using Enforcer.Modules.Gateway.RequestValidation;
using Enforcer.Modules.Gateway.Security;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Gateway;

public static class GatewayModule
{
    public static IApplicationBuilder UseGatewayPipeline(this IApplicationBuilder app)
    {
        app.UseMiddleware<PerformanceMetricsMiddleware>();
        app.UseMiddleware<RequestValidationMiddleware>();
        app.UseMiddleware<ApiKeyAuthenticationMiddleware>();
        app.UseMiddleware<EndpointTrieProviderMiddleware>();
        app.UseMiddleware<EndpointResolutionMiddleware>();
        app.UseMiddleware<EndpointAuthorizationMiddleware>();
        app.UseMiddleware<RateLimitMiddleware>();
        app.UseMiddleware<RequestForwardingMiddleware>();

        return app;
    }

    public static IServiceCollection AddGatewayModule(this IServiceCollection services)
    {
        services.AddHttpClient()
            .ConfigureHttpClientDefaults((opts) =>
                opts.ConfigurePrimaryHttpMessageHandler(() =>
                    new HttpClientHandler
                    {
                        AllowAutoRedirect = false,
                        UseCookies = false,
                        AutomaticDecompression = DecompressionMethods.None,
                        ServerCertificateCustomValidationCallback = HttpClientHandler
                        .DangerousAcceptAnyServerCertificateValidator
                    }));

        services.AddScoped<UsageTrackingService>();
        services.AddSingleton<RateLimitService>();

        return services;
    }
}