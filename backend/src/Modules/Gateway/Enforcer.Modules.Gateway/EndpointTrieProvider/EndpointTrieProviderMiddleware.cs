using Enforcer.Common.Application.Caching;
using Enforcer.Modules.Gateway.Extensions;
using Microsoft.AspNetCore.Http;

namespace Enforcer.Modules.Gateway.EndpointTrieProvider;

public class EndpointTrieProviderMiddleware(RequestDelegate next, ICacheService cacheService)
{
    public async Task InvokeAsync(HttpContext context)
    {
        // try fetch trie from cache and return the value.
        var serviceKey = context.GetServiceKey()!;
        var cacheKey = GetCacheKey(serviceKey);

        var endpointTrie = await cacheService.GetAsync<EndpointTrie>(cacheKey);
        if (endpointTrie is not null)
        {
            context.Features.Set<IEndpointTrieFeature>(new EndpointTrieFeature(endpointTrie));
            await next(context);
            return;
        }

        // if cache miss, hit the DB to fetch all endpoints for using the service key.
        // this call will return list of EndpointResponse.

        // pass the list to the EndpointTrie to build the Trie.
        endpointTrie = new EndpointTrie(Endpoint.Endpoints);

        // cache the new Trie and then return it.
        await cacheService.SetAsync(cacheKey, endpointTrie);

        context.Features.Set<IEndpointTrieFeature>(new EndpointTrieFeature(endpointTrie));
        await next(context);
    }

    private static string GetCacheKey(string serviceKey) => $"{serviceKey}:{nameof(EndpointTrie)}";
}