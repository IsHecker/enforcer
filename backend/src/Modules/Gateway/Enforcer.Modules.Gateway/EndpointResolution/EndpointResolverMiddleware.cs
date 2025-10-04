using Microsoft.AspNetCore.Http;

namespace Enforcer.Modules.Gateway.EndpointResolution;

public class EndpointResolverMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        await next(context);
    }
}