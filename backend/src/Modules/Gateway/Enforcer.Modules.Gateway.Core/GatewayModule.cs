using System.Net;
using Enforcer.Modules.Gateway.Core.EndpointResolution;
using Enforcer.Modules.Gateway.Core.EndpointTrieProvider;
using Enforcer.Modules.Gateway.Core.Performance;
using Enforcer.Modules.Gateway.Core.RateLimiting;
using Enforcer.Modules.Gateway.Core.RequestForwarding;
using Enforcer.Modules.Gateway.Core.RequestValidation;
using Enforcer.Modules.Gateway.Core.Security;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Gateway.Core;

public static class GatewayModule
{
    public static IApplicationBuilder UseGatewayPipeline(this IApplicationBuilder app)
    {
        app.MapWhen(
            context => !context.Request.Path.StartsWithSegments("/api"),
            proxyApp =>
            {
                proxyApp.UseMiddleware<PerformanceMetricsMiddleware>();
                proxyApp.UseMiddleware<RequestValidationMiddleware>();
                proxyApp.UseMiddleware<ApiKeyAuthenticationMiddleware>();
                proxyApp.UseMiddleware<EndpointTrieProviderMiddleware>();
                proxyApp.UseMiddleware<EndpointResolutionMiddleware>();
                proxyApp.UseMiddleware<EndpointAuthorizationMiddleware>();
                proxyApp.UseMiddleware<RateLimitMiddleware>();
                proxyApp.UseMiddleware<RequestForwardingMiddleware>();
            }
        );

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

        services.AddSingleton<RateLimitService>();

        return services;
    }
}