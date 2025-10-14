using Enforcer.Common.Application.Caching;
using Enforcer.Modules.ApiServices.PublicApi;
using Enforcer.Modules.Gateway.Extensions;
using Microsoft.AspNetCore.Http;

namespace Enforcer.Modules.Gateway.EndpointTrieProvider;

public class EndpointTrieProviderMiddleware(RequestDelegate next, ICacheService cacheService)
{
    public async Task InvokeAsync(HttpContext context, IApiServicesApi servicesApi)
    {
        var serviceKey = context.GetServiceKey()!;
        var apiServiceId = context.GetApiService()!.Id;

        var cacheKey = CacheKeys.EndpointTrie(serviceKey);

        var endpointTrie = await cacheService.GetAsync<EndpointTrie>(cacheKey);
        if (endpointTrie is not null)
        {
            context.Features.Set<IEndpointTrieFeature>(new EndpointTrieFeature(endpointTrie));
            await next(context);
            return;
        }

        var endpoints = await servicesApi.ListEndpointsForServiceAsync(apiServiceId);
        endpointTrie = new EndpointTrie(endpoints);

        await cacheService.SetAsync(cacheKey, endpointTrie);

        context.Features.Set<IEndpointTrieFeature>(new EndpointTrieFeature(endpointTrie));
        await next(context);
    }
}