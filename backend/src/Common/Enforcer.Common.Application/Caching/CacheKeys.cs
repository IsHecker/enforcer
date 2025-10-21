namespace Enforcer.Common.Application.Caching;

public static class CacheKeys
{
    // <context>:<type>:<identifier>
    public static string QuotaUsage(Guid subscriptionId) => $"quota:{subscriptionId}";
    public static string RateLimit(Guid subscriptionId, Guid sourceId) => $"ratelimit:{subscriptionId}:{sourceId}";
    public static string EndpointTrie(Guid apiServiceId) => $"endpoint-trie:{apiServiceId}";
}