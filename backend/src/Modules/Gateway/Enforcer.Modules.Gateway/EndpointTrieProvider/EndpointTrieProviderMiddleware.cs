using Enforcer.Common.Application.Caching;
using Enforcer.Modules.ApiServices.PublicApi;
using Enforcer.Modules.Gateway.Extensions;
using Microsoft.AspNetCore.Http;

namespace Enforcer.Modules.Gateway.EndpointTrieProvider;

public sealed class EndpointTrieProviderMiddleware(RequestDelegate next, ICacheService cacheService)
{
    public async Task InvokeAsync(HttpContext context, IApiServicesApi servicesApi)
    {
        var requestContext = context.GetRequestContext();
        var apiServiceId = requestContext.ApiService!.Id;

        var cacheKey = CacheKeys.EndpointTrie(apiServiceId);

        var endpointTrie = await cacheService.GetAsync<EndpointTrie>(cacheKey);
        if (endpointTrie is not null)
        {
            requestContext.EndpointTrie = endpointTrie;
            await next(context);
            return;
        }

        var endpoints = await servicesApi.ListEndpointsForServiceAsync(apiServiceId);
        endpointTrie = new EndpointTrie(endpoints);

        await cacheService.SetAsync(cacheKey, endpointTrie);

        requestContext.EndpointTrie = endpointTrie;
        await next(context);
    }
}