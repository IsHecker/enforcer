using System.Reflection;
using BenchmarkDotNet.Attributes;
using Enforcer.Modules.Gateway.EndpointResolution;
using Enforcer.Modules.Gateway.EndpointTrieProvider;
using Enforcer.Modules.Gateway.RequestValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Enforcer.Modules.ApiServices.Infrastructure;
using Enforcer.Common.Application;
using Enforcer.Common.Infrastructure;
using Enforcer.Modules.Gateway;
using Microsoft.AspNetCore.Builder;
using Enforcer.Common.Application.Caching;
using Enforcer.Modules.ApiServices.PublicApi;
using Microsoft.Extensions.Logging;
using Enforcer.Modules.Gateway.Security;
using Enforcer.Modules.Gateway.RateLimiting;
using Enforcer.Modules.ApiServices.Infrastructure.Database;

namespace Benchmarks;

[MemoryDiagnoser]
internal sealed class MiddlewareBenchmark
{
    private WebApplication app;
    private RequestDelegate _pipeline;
    private DefaultHttpContext context;
    private IServiceScope _scope;


    [ParamsSource(nameof(RequestUrlData))]
    public RequestUrlParam RequestUrl { get; set; }

    public static IEnumerable<RequestUrlParam> RequestUrlData()
    {
        yield return new RequestUrlParam("base", "https://localhost:7160/alpha-vantage/v5/assets/some-asset-id");
        yield return new RequestUrlParam("long ass url", "https://localhost:7160/alpha-vantage/v4/customers/87B67772-9FF1-4289-9FC2-87BA3E7A38D3/addresses/address-7CCDDE9F67844DA68FB46FD250EB");
        yield return new RequestUrlParam("search", "https://localhost:7160/alpha-vantage/v2/orders/7CCDDE9F67844DA68FB46FD250EB/line-items/line-item_id-7CCDDE9F6");
        yield return new RequestUrlParam("all todos", "https://localhost:7160/alpha-vantage/v5/invoices");
        yield return new RequestUrlParam("post comments", "https://localhost:7160/alpha-vantage/v3/assets/asset-id-D250EB");
        yield return new RequestUrlParam("todo ID", "https://localhost:7160/alpha-vantage/json-place-holder/tasks/todos/1");
    }

    [GlobalSetup]
    public void Setup()
    {
        var builder = WebApplication.CreateBuilder();

        builder.Services.AddLogging();
        builder.Logging.AddFilter("Microsoft.EntityFrameworkCore", LogLevel.None);
        builder.Services.AddDistributedMemoryCache();

        Assembly[] moduleApplicationAssemblies = [
            Enforcer.Modules.ApiServices.Application.AssemblyReference.Assembly];

        builder.Configuration["ConnectionStrings:Database"] = "Server=DESKTOP-7C1AVIR\\SQLEXPRESS;Database=Enforcer;Trusted_Connection=True;TrustServerCertificate=True";

        builder.Services.AddApplication(moduleApplicationAssemblies);

        builder.Services.AddInfrastructure();

        builder.Services.AddApiServicesModule(builder.Configuration);
        builder.Services.AddGatewayModule();

        app = builder.Build();

        _scope = app.Services.CreateScope();

        var serviceApi = _scope.ServiceProvider.GetRequiredService<IApiServicesApi>();

        var m6 = new RateLimitMiddleware((ctx) => Task.CompletedTask, _scope.ServiceProvider.GetRequiredService<RateLimitService>());
        var m5 = new EndpointAuthorizationMiddleware((ctx) => m6.InvokeAsync(ctx, _scope.ServiceProvider.GetRequiredService<IApiServicesApi>()));
        var m4 = new EndpointResolutionMiddleware((ctx) => m5.InvokeAsync(ctx, _scope.ServiceProvider.GetRequiredService<IApiServicesApi>()));
        var m3 = new EndpointTrieProviderMiddleware(m4.InvokeAsync, _scope.ServiceProvider.GetRequiredService<ICacheService>());
        var m2 = new ApiKeyAuthenticationMiddleware((ctx) => m3.InvokeAsync(ctx, _scope.ServiceProvider.GetRequiredService<IApiServicesApi>()));
        var m1 = new RequestValidationMiddleware((ctx) => m2.InvokeAsync(ctx, _scope.ServiceProvider.GetRequiredService<IApiServicesApi>()));

        _pipeline = (ctx) => m1.InvokeAsync(ctx, _scope.ServiceProvider.GetRequiredService<IApiServicesApi>());

    }

    [Benchmark(OperationsPerInvoke = 1000)]
    public async Task MiddlewarePipeline()
    {
        for (int i = 0; i < 1000; i++)
            await _pipeline(context);
    }

    [IterationSetup]
    public void ResetContext()
    {
        _scope?.Dispose();
        _scope = app.Services.CreateScope();

        var uri = new Uri(RequestUrl.Url);
        context = new DefaultHttpContext
        {
            RequestServices = _scope.ServiceProvider
        };

        context.Request.Scheme = uri.Scheme;
        context.Request.Host = new HostString(uri.Host, uri.Port);
        context.Request.Path = uri.AbsolutePath;
        context.Request.Method = "GET";
        context.Request.QueryString = new QueryString(uri.Query);
        context.Request.Headers["X-Api-Key"] = "API-7CCDDE9F67844DA68FB46FD250EB";
        context.Response.Body = new MemoryStream();
    }

    [GlobalCleanup]
    public void Cleanup()
    {
        _scope?.Dispose();
    }

    public record RequestUrlParam(string Name, string Url)
    {
        public override string ToString() => Name;
    }
}