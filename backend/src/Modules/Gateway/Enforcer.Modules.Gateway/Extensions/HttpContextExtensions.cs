using Microsoft.AspNetCore.Http;

namespace Enforcer.Modules.Gateway.Extensions;

public static class HttpContextExtensions
{
    private const string ServiceKey = "ServiceKey";
    private const string Route = "Route";


    public static void SetServiceKey(this HttpContext context, string serviceKey)
        => context.Items[ServiceKey] = serviceKey;

    public static string? GetServiceKey(this HttpContext context)
        => context.Items[ServiceKey] as string;


    public static void SetRoute(this HttpContext context, string route)
        => context.Items[Route] = route;

    public static string? GetRequestRoute(this HttpContext context)
        => context.Items[Route] as string;
}