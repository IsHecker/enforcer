using Enforcer.Modules.ApiServices.Contracts.ApiServices;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Microsoft.AspNetCore.Http;

namespace Enforcer.Modules.Gateway.Extensions;

public static class HttpContextExtensions
{
    private const string ApiService = "ApiService";
    private const string ServiceKey = "ServiceKey";
    private const string Subscription = "Subscription";
    private const string EndpointConfig = "EndpointConfig";
    private const string Path = "Path";
    private const string RequestUrl = "RequestUrl";
    private const string ServiceOverhead = "ServiceOverhead";


    public static void SetApiService(this HttpContext context, ApiServiceResponse apiService)
        => context.Items[ApiService] = apiService;

    public static ApiServiceResponse? GetApiService(this HttpContext context)
        => context.Items[ApiService] as ApiServiceResponse;

    public static void SetServiceKey(this HttpContext context, string serviceKey)
        => context.Items[ServiceKey] = serviceKey;

    public static string? GetServiceKey(this HttpContext context)
        => context.Items[ServiceKey] as string;

    public static void SetSubscription(this HttpContext context, SubscriptionResponse subscription)
    => context.Items[Subscription] = subscription;

    public static SubscriptionResponse? GetSubscription(this HttpContext context)
        => context.Items[Subscription] as SubscriptionResponse;

    public static void SetEndpointConfig(this HttpContext context, EndpointResponse endpointConfig)
    => context.Items[EndpointConfig] = endpointConfig;

    public static EndpointResponse? GetEndpointConfig(this HttpContext context)
        => context.Items[EndpointConfig] as EndpointResponse;

    public static void SetRequestPath(this HttpContext context, string path)
        => context.Items[Path] = path;

    public static string? GetRequestPath(this HttpContext context)
        => context.Items[Path] as string;

    public static void SetRequestUrl(this HttpContext context, Uri requestUrl)
        => context.Items[RequestUrl] = requestUrl;

    public static Uri? GetRequestUrl(this HttpContext context)
        => context.Items[RequestUrl] as Uri;

    public static void SetServiceOverhead(this HttpContext context, object serviceOverhead)
    => context.Items[ServiceOverhead] = serviceOverhead;

    public static object? GetServiceOverhead(this HttpContext context)
        => context.Items[ServiceOverhead];
}